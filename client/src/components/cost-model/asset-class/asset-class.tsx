// Simplified Asset Class component using generic MasterDataCRUD
import { MasterDataCRUD } from "../shared/master-data-crud";
import { assetClassConfig } from "../shared/master-data-configs.tsx";

export function AssetClass() {
  return <MasterDataCRUD config={assetClassConfig} />;
}

