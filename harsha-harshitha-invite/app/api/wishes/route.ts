import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const hasUrl = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  );
  const hasKey = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY
  );

  if (!supabase) {
    return NextResponse.json(
      {
        wishes: [],
        isCloud: false,
        message: "Supabase environment variables not detected on server.",
        debug: { hasUrl, hasKey },
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  try {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase wishes query error:", error);
      return NextResponse.json(
        {
          wishes: [],
          isCloud: false,
          error: error.message,
          debug: { hasUrl, hasKey },
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    return NextResponse.json(
      { wishes: data || [], isCloud: true, count: data?.length || 0 },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json(
      { wishes: [], isCloud: false, error: message },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, relation, tag, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          isCloud: false,
          error: "Supabase credentials missing on server",
        },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("wishes")
      .insert([
        {
          name: String(name).trim(),
          relation: String(relation || "Well Wisher"),
          tag: String(tag || "🌸 Shubh Vivah"),
          message: String(message).trim(),
          likes: 1,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, wish: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, increment } = body;

    if (!id || !supabase) {
      return NextResponse.json({ success: false });
    }

    const { data: currentWish } = await supabase
      .from("wishes")
      .select("likes")
      .eq("id", id)
      .single();

    if (currentWish) {
      const newLikes = Math.max(0, currentWish.likes + (increment ? 1 : -1));
      await supabase.from("wishes").update({ likes: newLikes }).eq("id", id);
      return NextResponse.json({ success: true, likes: newLikes });
    }

    return NextResponse.json({ success: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
