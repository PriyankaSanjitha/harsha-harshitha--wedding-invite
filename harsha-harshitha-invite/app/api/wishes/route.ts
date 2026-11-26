import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ wishes: [], isCloud: false });
  }

  try {
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching wishes from Supabase:", error);
      return NextResponse.json({
        wishes: [],
        isCloud: false,
        error: error.message,
      });
    }

    return NextResponse.json({ wishes: data || [], isCloud: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ wishes: [], isCloud: false, error: message });
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
      return NextResponse.json({
        success: false,
        isCloud: false,
        error: "Database not configured yet",
      });
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
      console.error("Error inserting wish into Supabase:", error);
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
