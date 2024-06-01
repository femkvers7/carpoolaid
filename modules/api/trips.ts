import type { Database } from "~/types/supabase";

export const getTripsByUserId = async (userId: string) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("trips")
    .select("*, locations(*)")
    .eq("user_id", userId);

  console.log("getTrips", data, error);

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

  console.log("createTrip", data, error);
  return { data, error };
};

export const deleteTrip = async (tripId: string) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("trips")
    .delete()
    .eq("id", tripId);

  console.log("deleteTrip", data, error);
  return { data, error };
};
