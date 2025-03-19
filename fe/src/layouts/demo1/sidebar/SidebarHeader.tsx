import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { useDemo1Layout } from '../';
import { toAbsoluteUrl } from '@/utils';
import { SidebarToggle } from './';

const SidebarHeader = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { layout } = useDemo1Layout();

  // Determines the logo source based on the theme
  const getLogoSrc = (type: 'default' | 'small') => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const basePath = '/media/app/';
    const logoMap = {
      default: isDarkMode ? `${basePath}disburse-dark.png` : `${basePath}disburse-light.png`,
      small: `${basePath}disburse-header.png`
    };
    return logoMap[type];
  };

  const renderLogo = () => (
    <Link to="/">
      <img alt="app-logo" src={getLogoSrc('default')} className="default-logo h-52 max-w-none" />
      <img alt="app-logo" src={getLogoSrc('small')} className="small-logo max-w-8" />
    </Link>
  );

  return (
    <div
      ref={ref}
      className="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0"
    >
      {renderLogo()}
      <SidebarToggle />
    </div>
  );
});

export { SidebarHeader };
