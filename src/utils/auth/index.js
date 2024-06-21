import { createClient } from "@/utils/supabase/server-props";

export async function requireAuth(context) {
  const supabase = createClient(context);

  const { data, error } = await supabase.auth.getSession();

  if (error || !data?.session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const user = data.session.user;

  return {
    props: {
      user,
    },
  };
}
