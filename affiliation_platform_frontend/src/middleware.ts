import { hasCookie } from "cookies-next";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export type UserEnumTypes = "AFFILIATE" | "SECRETARY" | "ADMIN"; // Add more User Roles at will

export type Tokens = {
  // Actual Token Type
  accessToken: string;
  refreshToken: string;
};

const loginUrls = ["/login", "/register", "/forgot-password"];
const staticPaths = ["/_next", "/images", "/public", "/static"];

const affiliateUrls = [
  "/affiliate/dashboard",
  "/affiliate/links",
  "/affiliate/mylinks",
  "/affiliate/subscriptions",
];

const secretaryUrls = [
  "/secretary/dashboard",
  "/secretary/affiliates",
  "/secretary/registration-requests",
  "/secretary/links",
  "/secretary/subscriptions",
  "/secretary/feedbacks",
  "/secretary/banners",
];

const adminUrls = [
  "/admin/dashboard",
  "/admin/affiliates",
  "/admin/secretaries",
  "/admin/administrators",
  "/admin/registration-requests",
  "/admin/links",
  "/admin/subscriptions",
  "/admin/feedbacks",
  "/admin/banners",
];

const protectedRoutes = [...affiliateUrls, ...secretaryUrls, ...adminUrls]; // Add all protected URLS here

export default function middleware(req: NextRequest) {
  const res = NextResponse.next();
  let isAuthenticated = false;
  let userType: UserEnumTypes = "AFFILIATE"; // Default
  const BASE_FRONTEND_URL = req.nextUrl.origin;
  const CURRENT_URL_PATHNAME = req.nextUrl.pathname;
  const isStaticPath = staticPaths.some((path) =>
    CURRENT_URL_PATHNAME.includes(path)
  );

  // First page a user will see(Redirected to) when they login based on role
  const DASHBOARDS = {
    affiliate: "/affiliate/dashboard",
    secretary: "/secretary/dashboard",
    admin: "/admin/dashboard",
    // Can and might be a dashboard page or any other
  };

  const hasRoute = (routes: Array<string>, currentPath: string) => {
    let isValid = false;

    routes.map((route) => {
      if (currentPath.includes(route)) {
        isValid = true;
      }
    });

    return isValid;
  };

  // Builds URL to be returned
  const buildUrl = (route: string) => {
    const absoluteURL = new URL(route, BASE_FRONTEND_URL);
    return absoluteURL.toString();
  };
  if (isStaticPath) {
    return res;
  }
  if (!isAuthenticated && hasRoute(loginUrls, CURRENT_URL_PATHNAME)) {
    return res;
  }

  // Checking that cookie exists and handling it
  if (hasCookie("authTokens", { cookies })) {
    let authTokens = req.cookies.get("authTokens")?.value; // Get cookies using Key(authTokens)

    if (authTokens && authTokens !== null && authTokens !== "{}") {
      // Checking for empty cookies
      const tokens = JSON.parse(authTokens) as Tokens; // Casting to actual Token Type
      const accessToken = tokens?.accessToken; // Getting the access token

      if (accessToken) {
        // Decoding Payload from access Token
        const decodedToken = jwtDecode(accessToken) as any;

        // Checking for Token expiry
        const isExpired =
          dayjs.unix(decodedToken.exp as number).diff(dayjs()) < 1;

        // If token is not expired set (isAuthenticated to True)
        if (!isExpired) {
          userType = decodedToken.role.toUpperCase() as UserEnumTypes;
          isAuthenticated = true;
        } else {
          return NextResponse.redirect(buildUrl("/login")); // SWAP FOR YOUR BASE LOGIN URL
        }
      }
    }
  }

  // Check if the current path has a matching route
  /**
   * E.g
   * currentRoute == "/student/remarks"
   */

  // IF USER IS UNATHENTICATED AND TRIES TO access a PROTECTED ROUTE (REDIRECTION)
  if (!isAuthenticated && hasRoute(protectedRoutes, CURRENT_URL_PATHNAME)) {
    return NextResponse.redirect(buildUrl("/login")); // SWAP FOR YOUR BASE LOGIN URL
  }

  if (isAuthenticated && hasRoute(protectedRoutes, CURRENT_URL_PATHNAME)) {
    switch (userType) {
      case "AFFILIATE":
        if (!hasRoute(affiliateUrls, CURRENT_URL_PATHNAME)) {
          return NextResponse.redirect(buildUrl(DASHBOARDS.affiliate));
        }
        break;
      case "SECRETARY":
        if (!hasRoute(secretaryUrls, CURRENT_URL_PATHNAME)) {
          return NextResponse.redirect(buildUrl(DASHBOARDS.secretary));
        }
        break;
      case "ADMIN":
        if (!hasRoute(adminUrls, CURRENT_URL_PATHNAME)) {
          return NextResponse.redirect(buildUrl(DASHBOARDS.admin));
        }
        break;

      // Add more -CASES- as you need
      default: // Random fallback if all cases fail (DO AS YOU WISH)
        return NextResponse.redirect(buildUrl(DASHBOARDS.affiliate));
    }
  }

  // BLocking access to Login URLS when authenticated
  if (isAuthenticated && hasRoute(loginUrls, CURRENT_URL_PATHNAME)) {
    if (userType === "AFFILIATE") {
      return NextResponse.redirect(buildUrl(DASHBOARDS.affiliate));
    } else if (userType === "SECRETARY") {
      return NextResponse.redirect(buildUrl(DASHBOARDS.secretary));
    } else if (userType === "ADMIN") {
      return NextResponse.redirect(buildUrl(DASHBOARDS.admin));
    }

    // ADD MORE TYPES AS YOU WISH
  }

  return res;
}
