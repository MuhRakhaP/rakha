import { ClockoraCheckIn } from "./clockora/checkin";
import { ClockoraHome } from "./clockora/home";
import { ClockoraLogin } from "./clockora/login";
import { ClockoraReports } from "./clockora/reports";
import { TerahomeInvoiceDetail } from "./terahome/invoice-detail";
import { ThinkPosCashier } from "./thinkpos/cashier";
import { ThinkPosDashboard } from "./thinkpos/dashboard";
import { ThinkPosLogin } from "./thinkpos/login";
import { ThinkPosReports } from "./thinkpos/reports";

/** A recreated screen body: fills whatever frame it is placed in. */
export type MockScreenComponent = () => React.JSX.Element;

/**
 * Slug then screen id to the component that draws it.
 *
 * Resolution is always `registry[slug][id]`, driven by the project's
 * `mockScreens` array. No component anywhere branches on a project name, so
 * adding a project is a data change and nothing else.
 */
export const MOCK_SCREEN_REGISTRY: Record<
  string,
  Record<string, MockScreenComponent>
> = {
  thinkpos: {
    login: ThinkPosLogin,
    dashboard: ThinkPosDashboard,
    cashier: ThinkPosCashier,
    reports: ThinkPosReports,
  },
  clockora: {
    login: ClockoraLogin,
    home: ClockoraHome,
    checkin: ClockoraCheckIn,
    reports: ClockoraReports,
  },
  terahome: {
    "invoice-detail": TerahomeInvoiceDetail,
  },
};

/** The screens registered for a slug, or an empty map when it has none. */
export function getMockScreens(slug: string): Record<string, MockScreenComponent> {
  return MOCK_SCREEN_REGISTRY[slug] ?? {};
}