import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { AuthPage, RequireAuth } from '@/auth';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { WalletPage } from '@/pages/views/wallets/WalletPage.tsx';
import { AccountUserProfilePage } from '@/pages/account/user-profile';
import { TransactionPage } from '@/pages/views/transactions/TransactionPage.tsx';
import { PayoutPage } from '@/pages/views/payouts/PayoutPage.tsx';
import { ChainPage } from '@/pages/views/chain/ChainPage.tsx';
import { StablecoinPage } from '@/pages/views/stablecoins/StablecoinPage.tsx';
import { TrusdPage } from '@/pages/views/trusds/TrusdPage.tsx';
import { StripePayment } from '@/pages/views/trusds/StripePayment';


const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<WalletPage />} />
          <Route path="/stripe" element={<StripePayment />} />
          <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
          <Route
            path="/wallets/*"
            element={
              <Routes>
                <Route path="/" element={<WalletPage />} />
                <Route path="/transactions/:addressID" element={<TransactionPage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/chains/*"
            element={
              <Routes>
                <Route path="/" element={<ChainPage />} />
              </Routes>
            }
          ></Route>
          <Route path="/" element={<PayoutPage />} />
          <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
          <Route
            path="/payouts/*"
            element={
              <Routes>
                <Route path="/" element={<PayoutPage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/stablecoins/*"
            element={
              <Routes>
                <Route path="/" element={<StablecoinPage />} />
              </Routes>
            }
          ></Route>
          <Route
            path="/trusds/*"
            element={
              <Routes>
                <Route path="/" element={<TrusdPage />} />
              </Routes>
            }
          ></Route>
          
        </Route>
      </Route>

      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />

      <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
    </Routes>
  );
};

export { AppRoutingSetup };
