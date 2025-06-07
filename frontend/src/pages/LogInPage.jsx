
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router';

const signupSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string()
    .min(8, "Password must have at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

function LogInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = (data) => {
    console.log(data);

    // Backend data ko send kar dena chaiye?
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-300 " 
    style={{
        backgroundImage: `
          linear-gradient(to bottom right,#1f1f1f,#000
      )
        `,
        backgroundSize: '48px 48px',
        backgroundRepeat: 'repeat',
        backdropFilter: 'blur(2px)',
      }}> 
       <div className="absolute top-0 left-0 w-full h-36 pointer-events-none" 
    style={{
      background: 'linear-gradient(to bottom, #111 0% , transparent 100%)'
    }} 
  />
      <div className="card w-96 bg-base-100 shadow-xl hover:shadow-indigo-600/40"> 
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold text-indigo-500 hover:text-indigo-700">CODING PLATFORM</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Existing form fields */}

            <div className="form-control">
              <label className="label mb-1">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="john@example.com"
                className={`input input-bordered ${errors.emailId && 'input-error'}`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error">{errors.emailId.message}</span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label mb-1">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered ${errors.password && 'input-error'}`}
                {...register('password')}
              />
              {errors.password && (
                <span className="text-error">{errors.password.message}</span>
              )}
            </div>

            <div className="form-control mt-6 flex justify-center">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="text-sm text-indigo-500 hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogInPage;