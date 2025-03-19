import { useEffect, useRef, useState } from 'react';

import { toAbsoluteUrl } from '@/utils';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';

import { useLanguage } from '@/i18n';
import { MetaAccountConnector } from '@/pages/meta-component/MetaAccount.tsx';
import { useNavigate } from 'react-router';
import { getAuth } from '@/auth';

const HeaderTopbar = () => {
  const { isRTL } = useLanguage();

  const itemUserRef = useRef<any>(null);
  const itemNotificationsRef = useRef<any>(null);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const role = getAuth()?.user.role;
    if (role === 'DISBURSE_ADMIN') {
      setAdmin(true);
    }
  }, []);

  return (
    <div className="flex items-center gap-2 lg:gap-3.5">
      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [70, 10] : [-70, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn hover:text-primary  dropdown-open:text-primary text-gray-800"></MenuToggle>
        </MenuItem>
      </Menu>
      {admin && (
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/chains')}>
          Chains
        </button>
      )}
      <MetaAccountConnector />

      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-20, 10] : [20, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            <img
              className="size-9 rounded-full border-2 border-success shrink-0"
              src={toAbsoluteUrl('/media/avatars/300-2.png')}
              alt=""
            />
          </MenuToggle>
          {DropdownUser({ menuItemRef: itemUserRef })}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderTopbar };
