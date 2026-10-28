import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import ScrollToTop from "./components/shared/ScrollToTop";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import ShortsScreen from "./pages/ShortsScreen";
import SearchScreen from "./pages/SearchScreen";
import LiveTvScreen from "./pages/LiveTvScreen";
import ShortsPlayerScreen from "./pages/ShortsPlayerScreen";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";
import OtpVerificationPage from "./pages/auth/OtpVerificationPage";
import OutOfRegionPage from "./pages/auth/OutOfRegionPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import SubscriptionHistoryPage from "./pages/SubscriptionHistoryPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import SeriesDetailsPage from "./pages/SeriesDetailsPage";
import WatchPage from "./pages/WatchPage";
import TvGuidePage from "./pages/TvGuidePage";
import ProfilePage from "./pages/ProfilePage";
import MyStuffPage from "./pages/MyStuffPage";
import MoviesPage from "./pages/MoviesPage";
import NotificationsPage from "./pages/NotificationsPage";
import TvodPage from "./pages/tvod/TvodPage";
import TvodTitlePage from "./pages/tvod/TvodTitlePage";
import OrderSummaryPage from "./pages/tvod/OrderSummaryPage";
import PayWithCardPage from "./pages/tvod/PayWithCardPage";
import MobileMoneyPage from "./pages/tvod/MobileMoneyPage";
import MomoProcessingPage from "./pages/tvod/MomoProcessingPage";
import PaymentResultPage from "./pages/tvod/PaymentResultPage";


// MainLayout is used as a layout route — the matched page renders through its <Outlet/>.
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth flow — public, no footer, no mobile app chrome (own AuthShell) */}
        <Route element={<MainLayout showFooter={false} mobileChrome={false} />}>
          {/* WONA has one network, so the old network picker just forwards to sign-in */}
          <Route path="/select-network" element={<Navigate to="/signin" replace />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/otp-verification" element={<OtpVerificationPage />} />
          <Route path="/out-of-region" element={<OutOfRegionPage />} />
        </Route>

        <Route element={<MainLayout revealFooter />}>
          {/* Public landing at "/" (legacy landing.js); authed users bounce to /home */}
          <Route index element={<LandingPage />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/subscriptions" element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
          <Route path="/subscription-history" element={<ProtectedRoute><SubscriptionHistoryPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/my-stuff" element={<ProtectedRoute><MyStuffPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/movie/:id" element={<ProtectedRoute><MovieDetailsPage /></ProtectedRoute>} />
          <Route path="/series/:id" element={<ProtectedRoute><SeriesDetailsPage /></ProtectedRoute>} />

          <Route path="/movies" element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>

        {/* No footer — results/skeleton are self-contained. Mobile keeps the standard app
           bar (AfriPlay behaviour; the WONA comps omit it, but without it the bell and
           account menu are unreachable on search — decision 2026-10-28). */}
        <Route element={<MainLayout showFooter={false} />}>
          <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
        </Route>

        {/* Mobile: status-bar-only top (the feed supplies its own AfriShorts header). */}
        <Route element={<MainLayout revealFooter mobileTopBar="status" />}>
          <Route path="/shorts" element={<ProtectedRoute><ShortsScreen /></ProtectedRoute>} />
        </Route>

        {/* Live TV — desktop EPG at md+, mobile landing below md. Mobile page supplies
           its own "Afriplay Live Tv" header, so status-bar-only top. */}
        <Route element={<MainLayout revealFooter mobileTopBar="status" />}>
          <Route path="/live" element={<ProtectedRoute><LiveTvScreen /></ProtectedRoute>} />
        </Route>

        {/* TV Guide is one responsive page with no mobile header of its own, so it needs
           the standard app bar. It used to sit in the /live group above and inherited
           mobileTopBar="status" — which left mobile /tv-guide with no top nav at all. */}
        <Route element={<MainLayout revealFooter />}>
          <Route path="/tv-guide" element={<ProtectedRoute><TvGuidePage /></ProtectedRoute>} />
        </Route>

        {/* Full-bleed players — no footer, no mobile chrome (own controls/status bar),
            own MainLayout instances. The watch player also drops the desktop navbar
            (immersive, legacy parity); the shorts player keeps it per its design. */}
        <Route element={<MainLayout showFooter={false} mobileChrome={false} />}>
          <Route path="/shorts/:id" element={<ProtectedRoute><ShortsPlayerScreen /></ProtectedRoute>} />
        </Route>
        <Route element={<MainLayout showFooter={false} showNavbar={false} mobileChrome={false} />}>
          <Route path="/watch/:type/:id" element={<ProtectedRoute><WatchPage /></ProtectedRoute>} />
        </Route>

        {/* WonaPremiere / TVOD (rent or buy) — WONA mobile designs; each screen has its own
            header, so no mobile chrome; on desktop they sit in a phone-width column. */}
        <Route element={<MainLayout showFooter={false} mobileChrome={false} />}>
          <Route path="/premiere" element={<ProtectedRoute><TvodPage /></ProtectedRoute>} />
          <Route path="/premiere/:id" element={<ProtectedRoute><TvodTitlePage /></ProtectedRoute>} />
          <Route path="/premiere/:id/checkout" element={<ProtectedRoute><OrderSummaryPage /></ProtectedRoute>} />
          <Route path="/premiere/:id/pay/card" element={<ProtectedRoute><PayWithCardPage /></ProtectedRoute>} />
          <Route path="/premiere/:id/pay/momo" element={<ProtectedRoute><MobileMoneyPage /></ProtectedRoute>} />
          <Route path="/premiere/:id/pay/momo/processing" element={<ProtectedRoute><MomoProcessingPage /></ProtectedRoute>} />
          <Route path="/premiere/:id/result/:status" element={<ProtectedRoute><PaymentResultPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
