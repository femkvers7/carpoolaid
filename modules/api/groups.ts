import type { Database, TablesInsert } from "~/types/supabase";

export const createGroup = async (group: TablesInsert<"groups">) => {
  const supabase = useSupabaseClient<Database>();
  const { data, error } = await supabase.from("groups").insert(group).select();
  return { data, error };
};
