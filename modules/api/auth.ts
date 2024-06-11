export const registerUser = async (email: string, password: string) => {
  const supabase = useSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "/auth/confirmed-email",
    },
  });
};

export const loginUser = async (email: string, password: string) => {
  const supabase = useSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const logoutUser = async () => {
  const supabase = useSupabaseClient();

  const { error } = await supabase.auth.signOut();

  navigateTo("/");
};
