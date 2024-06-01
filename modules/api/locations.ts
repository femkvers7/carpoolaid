import type { Database, TablesInsert } from "~/types/supabase";

export const getLocationById = async (id: string) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("locations")
    .select()
    .eq("id", id);

  console.log("getLocationById", data, error);
  return { data, error };
};

export const getLocationsById = async (ids: string[]) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("locations")
    .select()
    .in("id", ids);

  console.log("getLocationsById", data, error);
  return { data, error };
};

export const createLocation = async (location: TablesInsert<"locations">) => {
  const supabase = useSupabaseClient<Database>();

  const { data, error } = await supabase
    .from("locations")
    .insert(location)
    .select();

  console.log("createLocation", data, error);
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

  console.log("createLocations", data, error);
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

  console.log("updateLocation", data, error);
  return { data, error };
};
