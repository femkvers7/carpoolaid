import type { Database, TablesInsert } from "~/types/supabase";

export const getLocationById = async (id: string) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("locations")
    .select()
    .eq("id", id);

  return { data, error };
};

export const getLocationsById = async (ids: string[]) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("locations")
    .select()
    .in("id", ids);

  return { data, error };
};

export const createLocation = async (location: TablesInsert<"locations">) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("locations")
    .insert(location)
    .select();

  return { data, error };
};

export const createLocations = async (
  locations: TablesInsert<"locations">[],
) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("locations")
    .insert(locations)
    .select();

  return { data, error };
};

export const updateLocation = async (
  id: string,
  updates: { [key: string]: any },
) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("locations")
    .update(updates)
    .eq("id", id);

  return { data, error };
};
