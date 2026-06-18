import { NextResponse } from 'next/server';
import { scoreCourses } from '@/services/recommendationEngine';
import { generateExplanation } from '@/services/explanationEngine';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, userId } = body;

    if (!data) {
      return NextResponse.json(
        { error: 'Missing assessment data in request body.' },
        { status: 400 }
      );
    }

    // Calculate scores for all courses
    const allScored = scoreCourses(data);

    // Take the top 5 recommended courses and append detailed explanations
    const top5 = allScored.slice(0, 5).map((scored) => {
      const explanation = generateExplanation(data, scored.course);
      return {
        ...scored,
        explanation,
      };
    });

    // If a user is authenticated, save the recommendations to Supabase in the background
    let dbUserId = userId;

    if (!dbUserId) {
      // Fallback check: try to fetch from current supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      dbUserId = session?.user?.id || null;
    }

    if (dbUserId) {
      // Clean up previous recommendations for this user first
      const { error: deleteError } = await supabase
        .from('recommendations')
        .delete()
        .eq('user_id', dbUserId);

      if (deleteError) {
        console.error('Error clearing old recommendations:', deleteError);
      }

      // Format recommendations for insert
      const insertRows = top5.map((scored) => ({
        user_id: dbUserId,
        career_title: scored.course.name,
        match_score: scored.score,
        reasoning: scored.explanation.whyThisCourseFits,
        recommended_paths: scored.course.interests,
        created_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase.from('recommendations').insert(insertRows);

      if (insertError) {
        console.error(
          'Error saving recommendations to Supabase:',
          insertError.message,
          `\nDetails: ${insertError.details}`,
          `\nHint: ${insertError.hint}`
        );
      }

      // Save raw assessment responses to Supabase
      const { error: responseError } = await supabase.from('assessment_responses').insert({
        user_id: dbUserId,
        responses: data,
        completed_at: new Date().toISOString(),
      });

      if (responseError) {
        console.error('Error saving assessment responses to Supabase:', responseError.message);
      }
    }

    return NextResponse.json({
      success: true,
      recommendations: top5,
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error in recommendation API handler:', err);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: err?.message,
        stack: err?.stack,
      },
      { status: 500 }
    );
  }
}
