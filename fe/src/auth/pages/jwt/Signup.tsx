import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { useAuthContext } from '@/auth';
import { Alert, KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  changepassword: '',
  role: 'DISBURSE_USER'
};

const signupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
  firstName: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('First Name is required'),
  lastName: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Last Name is required')
});
const Signup = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentLayout } = useLayout();

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      if (!executeRecaptcha) {
        console.warn('Execute reCAPTCHA not yet available');
        return;
      }

      setLoading(true);
      try {
        // Get reCAPTCHA token
        const token = await executeRecaptcha('LOGIN'); // 'recaptcha-token-test';
        console.log('reCAPTCHA token:', token);

        if (!register) {
          throw new Error('JWTProvider is required for this form.');
        }

        const role = 'DISBURSE_USER';
        await register(
          values.email,
          values.password,
          role,
          false,
          token,
          values.firstName,
          values.lastName
        );
        navigate('/auth/check-email', { replace: true });
      } catch (error: any) {
        setStatus(error?.message);
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  const togglePassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">Sign Up</h3>
          <div className="flex items-center justify-center font-medium">
            <span className="text-2sm text-gray-600 me-1.5">Already have an Account ?</span>
            <Link
              to={currentLayout?.name === 'auth-branded' ? '/auth/login' : '/auth/classic/login'}
              className="text-2sm link"
            >
              Sign In
            </Link>
          </div>
        </div>

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className={'grid grid-cols-2 gap-2'}>
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">First Name</label>
            <label className="input">
              <input
                placeholder={'First Name'}
                type="text"
                autoComplete="off"
                {...formik.getFieldProps('firstName')}
                className={clsx(
                  'form-control bg-transparent',
                  { 'is-invalid': formik.touched.firstName && formik.errors.firstName },
                  {
                    'is-valid': formik.touched.firstName && !formik.errors.firstName
                  }
                )}
              />
            </label>
            {formik.touched.firstName && formik.errors.firstName && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.firstName}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">Last Name</label>
            <label className="input">
              <input
                placeholder="Last Name"
                type="text"
                autoComplete="off"
                {...formik.getFieldProps('lastName')}
                className={clsx(
                  'form-control bg-transparent',
                  { 'is-invalid': formik.touched.lastName && formik.errors.lastName },
                  {
                    'is-valid': formik.touched.lastName && !formik.errors.lastName
                  }
                )}
              />
            </label>
            {formik.touched.lastName && formik.errors.lastName && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.lastName}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              placeholder="email@email.com"
              type="email"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email
                }
              )}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Password</label>
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              autoComplete="off"
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.password && formik.errors.password
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password
                }
              )}
            />
            <button className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: showPassword })}
              />
              <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: !showPassword })} />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Confirm Password</label>
          <label className="input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter Password"
              autoComplete="off"
              {...formik.getFieldProps('changepassword')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.changepassword && formik.errors.changepassword
                },
                {
                  'is-valid': formik.touched.changepassword && !formik.errors.changepassword
                }
              )}
            />
            <button className="btn btn-icon" onClick={toggleConfirmPassword}>
              <KeenIcon
                icon="eye"
                className={clsx('text-gray-500', { hidden: showConfirmPassword })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showConfirmPassword })}
              />
            </button>
          </label>
          {formik.touched.changepassword && formik.errors.changepassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.changepassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Please wait...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export { Signup };
