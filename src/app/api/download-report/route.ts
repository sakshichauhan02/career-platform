import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-key';
const getSupabaseClient = () => createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing report download id' }, { status: 400 });
    }

    let filePath = '';
    const supabase = getSupabaseClient();

    // 1. Try to find the file location from database if it's not a mock-id
    const isMock = id.startsWith('mock-id-');
    if (!isMock) {
      try {
        const { data, error } = await supabase
          .from('report_downloads')
          .select('file_path, download_count')
          .eq('id', id)
          .maybeSingle();

        if (data && !error) {
          filePath = data.file_path;

          // Increment download count
          await supabase
            .from('report_downloads')
            .update({ download_count: (data.download_count || 0) + 1 })
            .eq('id', id);
        }
      } catch (dbErr) {
        console.error('Failed to query or update database for report download:', dbErr);
      }
    }

    // 2. Mock ID fallback or Database Query fallback
    if (!filePath) {
      // If it's a mock ID, extract the timestamp if possible
      const timestampPart = isMock ? id.replace('mock-id-', '') : '';
      const localDir = path.join(process.cwd(), 'public', 'reports');

      if (fs.existsSync(localDir)) {
        const files = fs.readdirSync(localDir);
        let foundFile = '';

        if (timestampPart) {
          // Look for file containing the timestamp
          foundFile = files.find((f) => f.includes(timestampPart)) || '';
        }

        // If not found, use the latest file in the directory
        if (!foundFile && files.length > 0) {
          const fileDetails = files.map((f) => {
            const stat = fs.statSync(path.join(localDir, f));
            return { name: f, mtime: stat.mtimeMs };
          });
          fileDetails.sort((a, b) => b.mtime - a.mtime);
          foundFile = fileDetails[0].name;
        }

        if (foundFile) {
          filePath = `/reports/${foundFile}`;
        }
      }
    }

    if (!filePath) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // 3. Serve the PDF file
    let pdfBuffer: Buffer;

    if (filePath.startsWith('/reports/') || filePath.startsWith('public/')) {
      // Local serving
      const filename = path.basename(filePath);
      const localFilePath = path.join(process.cwd(), 'public', 'reports', filename);

      if (!fs.existsSync(localFilePath)) {
        return NextResponse.json({ error: 'Report PDF file not found on server' }, { status: 404 });
      }

      pdfBuffer = fs.readFileSync(localFilePath);
    } else {
      // Supabase Storage serving
      const { data, error } = await supabase.storage.from('career-reports').download(filePath);

      if (error || !data) {
        console.error('Failed to download from Supabase storage, trying local fallback:', error);
        // Fallback: check if the file is locally saved in public/reports with the storage filename
        const localFilePath = path.join(
          process.cwd(),
          'public',
          'reports',
          path.basename(filePath)
        );
        if (fs.existsSync(localFilePath)) {
          pdfBuffer = fs.readFileSync(localFilePath);
        } else {
          return NextResponse.json(
            { error: 'Failed to download report from storage' },
            { status: 404 }
          );
        }
      } else {
        const arrayBuffer = await data.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
      }
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Career_Pathway_Report.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error serving report download:', error);
    return NextResponse.json(
      { error: 'Failed to download report', details: error.message },
      { status: 500 }
    );
  }
}
