import { KeenIcon } from '@/components';

import { CrudAvatarUpload } from '@/partials/crud';
import { getAuth, setAuth } from '@/auth';
import { useEffect, useState } from 'react';
import { updateUser } from '@/services/user_services.ts';

const PersonalInfo = () => {
  const currentUser = getAuth()?.user;
  const [edit, setEdit] = useState('');

  const initialFormState = {
    name: currentUser?.firstName,
    email: currentUser?.email,
    password: ''
  };

  const [form, setForm] = useState(initialFormState);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpdate = async () => {
    const updatedFields: any = {};
    Object.keys(form).forEach((key) => {
      if (
        form[key as keyof typeof form] !== initialFormState[key as keyof typeof initialFormState]
      ) {
        updatedFields[key] = form[key as keyof typeof form];
      }
    });

    if (Object.keys(updatedFields).length > 0) {
      const updatedUser = await updateUser(currentUser?.id as number, updatedFields);
      if (updatedUser.id) {
        setEdit('');
        setAuth({
          access_token: getAuth()?.access_token as string,
          user: {
            id: updatedUser.id || getAuth()?.user.id,
            firstName: updatedUser.name || getAuth()?.user.firstName,
            email: updatedUser.email || getAuth()?.user.email,
            lastName: updatedUser.lastName || getAuth()?.user.lastName,
            role: updatedUser.role || getAuth()?.user.role,
            theme: updatedUser.theme || getAuth()?.user.theme
          }
        });
      }
    }
  };

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">Personal Info</h3>
        {edit != '' && (
          <div className={''}>
            <button
              onClick={() => handleUpdate()}
              className={'btn btn-sm text-xs btn-primary items-center'}
            >
              <KeenIcon icon={'setting'} />
              update profile
            </button>
          </div>
        )}
      </div>
      <div className="card-table scrollable-x-auto pb-3">
        <table className="table align-middle text-sm text-gray-500">
          <tbody>
            <tr>
              <td className="py-2 min-w-28 text-gray-600 font-normal">Photo</td>
              <td className="py-2 text-gray700 font-normal min-w-32 text-2sm">
                150x150px JPEG, PNG Image
              </td>
              <td className="py-2 text-center">
                <div className="flex justify-center items-center">
                  <CrudAvatarUpload />
                </div>
              </td>
            </tr>
            <tr className={''}>
              <td className="py-2 text-gray-600  font-normal">Name</td>
              {edit === 'name' && (
                <div className={'py-2'}>
                  <input
                    name={'name'}
                    value={form.name}
                    onChange={handleInputChange}
                    className={'input '}
                    type={'text'}
                  />
                </div>
              )}
              {edit !== 'name' && (
                <td className="py-2 text-gray-800 font-normaltext-sm">{currentUser?.firstName}</td>
              )}
              <td className="py-2 text-center">
                <div
                  onClick={() => setEdit('name')}
                  className="btn btn-sm btn-icon btn-clear btn-primary"
                >
                  <KeenIcon icon="notepad-edit" />
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Email</td>
              {edit === 'email' && (
                <div className={'py-2'}>
                  <input
                    name={'email'}
                    value={form.email}
                    onChange={handleInputChange}
                    className={'input '}
                    type={'text'}
                  />
                </div>
              )}
              {edit !== 'email' && (
                <td className="py-2 text-gray-800 font-normaltext-sm">{currentUser?.email}</td>
              )}

              <td className="py-2 text-center">
                {/*<div*/}
                {/*  onClick={() => setEdit('email')}*/}
                {/*  className="btn btn-sm btn-icon btn-clear btn-primary"*/}
                {/*>*/}
                {/*  <KeenIcon icon="notepad-edit" />*/}
                {/*</div>*/}
              </td>
            </tr>

            <tr>
              <td className="py-3 text-gray-600 font-normal">Password</td>
              <td className="py-3 text-gray-800 font-normal">
                {edit === 'password' && (
                  <div className={'py-2'}>
                    <input
                      name={'password'}
                      value={form.password}
                      placeholder={'Enter new password'}
                      onChange={handleInputChange}
                      className={'input '}
                      type={'text'}
                    />
                  </div>
                )}
                {edit !== 'password' && (
                  <div onClick={() => setEdit('password')} className="btn btn-sm btn-secondary">
                    Change Password
                  </div>
                )}
              </td>
              <td className="py-3 text-center"></td>
            </tr>
            {/*<tr>*/}
            {/*  <td className="py-3 text-gray-600 font-normal">Birthday</td>*/}
            {/*  <td className="py-3 text-gray-700 text-sm font-normal">28 May 1996</td>*/}
            {/*  <td className="py-3 text-center">*/}
            {/*    <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">*/}
            {/*      <KeenIcon icon="notepad-edit" />*/}
            {/*    </a>*/}
            {/*  </td>*/}
            {/*</tr>*/}
            {/*<tr>*/}
            {/*  <td className="py-3 text-gray-600 font-normal">Gender</td>*/}
            {/*  <td className="py-3 text-gray-700 text-sm font-normal">Male</td>*/}
            {/*  <td className="py-3 text-center">*/}
            {/*    <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">*/}
            {/*      <KeenIcon icon="notepad-edit" />*/}
            {/*    </a>*/}
            {/*  </td>*/}
            {/*</tr>*/}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { PersonalInfo };
