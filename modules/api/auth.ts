export const registerUser = async (email: string, password: string) => {
  const supabase = useSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "/auth/confirmed-email",
    },
  });

  console.log("registered", data, error);
};

export const loginUser = async (email: string, password: string) => {
  const supabase = useSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("loggedIn", data, error);

  return { data, error };
};

export const logoutUser = async () => {
  const supabase = useSupabaseClient();

  const { error } = await supabase.auth.signOut();

  console.log("loggedOut", error);

  navigateTo("/");
};
