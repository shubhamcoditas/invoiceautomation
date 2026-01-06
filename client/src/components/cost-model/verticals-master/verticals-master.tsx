// Simplified Verticals Master component using generic MasterDataCRUD
import { MasterDataCRUD } from "../shared/master-data-crud";
import { verticalConfig } from "../shared/master-data-configs.tsx";

export function VerticalsMaster() {
  return <MasterDataCRUD config={verticalConfig} />;
}
