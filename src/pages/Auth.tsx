import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8 p-6 bg-card rounded-lg shadow-lg border">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <SupabaseAuth 
          supabaseClient={supabase} 
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#1a1d24',
                  brandAccent: '#2a2d34',
                }
              }
            }
          }}
          providers={[]}
        />
      </div>
    </Layout>
  );
};

export default Auth;