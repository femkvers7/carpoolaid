import type { Database } from "~/types/supabase";

export const getTripsByUserId = async (userId: string) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("trips")
    .select("*, locations(*)")
    .order("created_at", { ascending: false })
    .eq("user_id", userId)
    .eq("locations.type", "destination");

  return { data, error };
};

export const getTripById = async (tripId: string) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("trips")
    .select("*, locations(*), groups(*)")
    .eq("id", tripId)
    .single();

  return { data, error };
};

export const createTrip = async ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: userId,
      name,
    })
    .select();

  return { data, error };
};

export const deleteTrip = async (tripId: string) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("trips")
    .delete()
    .eq("id", tripId);

  return { data, error };
};
