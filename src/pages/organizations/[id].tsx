import { Loader2, MoreVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FinishWarehouseReservationDialog } from "~/components/dialogs/finishWarehouseInventoryReservationDialog";
import { InventoryCreditActionDialog } from "~/components/dialogs/inventoryCreditActionDialog";
import { WarehouseInventoryCreditActionDialog } from "~/components/dialogs/warehouseInventoryCreditActionDialog";
import { DownloadRetirementButton } from "~/components/downloadRetirementButton";
import { Button } from "~/components/ui/button";
import { cn, formatTimeSince, middleEllipses } from "~/utils";
import { api } from "~/utils/api";
import { CreditActionEnum } from "~/utils/icrTypes";

export default function Organization() {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: organization,
    isLoading: isLoadingOrganization,
    error: orgError,
  } = api.organization.get.useQuery({
    organizationId: id as string,
  });
  const {
    data: inventory,
    isLoading: isLoadingInventory,
    error: invError,
  } = api.icr.organizationInventory.useQuery({
    organizationId: id as string,
  });
  const {
    data: retirements,
    isLoading: isLoadingRetirements,
    error: retirementsError,
  } = api.icr.organizationRetirements.useQuery({
    organizationId: id as string,
  });
  console.log("RETIREMENTS:", retirements);
  const {
    data: warehouseInventory,
    isLoading: isLoadingWarehouseInventory,
    error: warehouseError,
  } = api.icr.organizationWarehouseInventory.useQuery({
    organizationId: id as string,
  });
  const {
    data: warehouseReservations,
    isLoading: isLoadingWarehouseReservations,
    error: reservationsError,
  } = api.icr.warehouseReservations.useQuery({
    organizationId: id as string,
  });
  const {
    data: inventoryRequests,
    isLoading: isLoadingInventoryRequests,
    error: requestsError,
  } = api.icr.inventoryRequests.useQuery({
    organizationId: id as string,
  });

  const {
    mutateAsync: cancelReservation,
    isLoading: isLoadingCancel,
    error: cancelError,
  } = api.icr.cancelReservation.useMutation();

  return (
    <div>
      <div className="mb-4 flex items-center">
        <>
          {isLoadingOrganization && (
            <Loader2 className="w-5 animate-spin text-primary" />
          )}
        </>
        <>
          <Image
            src={organization?.logo ?? ""}
            width={100}
            height={100}
            alt="logo"
            className="mr-2 h-14 w-14 rounded-full"
          />
          <div className="text-lg font-bold">{organization?.fullName}</div>
        </>
        {orgError?.message}
      </div>
      <div>
        {isLoadingInventory && (
          <Loader2 className="w-5 animate-spin text-primary" />
        )}
        {!isLoadingInventory && (
          <div className="mb-4 rounded-md bg-gray-50 p-4">
            <div className="mb-4 font-medium text-gray-500">Inventory</div>
            {invError?.message}
            {!invError?.message && (
              <div className="mb-3 grid grid-cols-12">
                <div className="col-span-3">Serial</div>
                <div className="col-span-1">type</div>
                <div className="col-span-3">amount</div>
                <div className="col-span-3">project</div>
                <div className="col-span-2">actions</div>
                {inventory?.credits?.map((inv) => {
                  return (
                    <div
                      key={inv.id}
                      className="col-span-12 mb-3 grid grid-cols-12"
                    >
                      <div className="col-span-3">{inv.serialization}</div>
                      <div className="col-span-1">{inv.type}</div>
                      <div className="col-span-3">{inv.amount}</div>
                      <div className="col-span-3">{inv.project.fullName}</div>
                      <div className="col-span-2 cursor-pointer">
                        <InventoryCreditActionDialog
                          credit={inv}
                          trigger={<MoreVertical />}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mb-2 font-medium text-gray-500">
              Credit action requests
            </div>

            {inventoryRequests?.map((request) => {
              return (
                <div
                  key={request.id}
                  className={cn("mb-3 flex rounded-md px-5 py-3", {
                    "border border-green-500 bg-green-100": request.txId,
                    "border border-red-500 bg-red-100":
                      request.state === "Rejected",
                    "border border-gray-200 bg-gray-100":
                      request.state === "Pending",
                  })}
                >
                  <div className="flex flex-1 items-center">
                    <div className="text-xs font-medium text-black">
                      <span className="font-normal text-gray-500">
                        Requesting a{" "}
                        {request.action === CreditActionEnum.transfer_retire
                          ? "transfer and retire"
                          : request.action}{" "}
                        of <span className="font-bold">{request.amount}</span>{" "}
                        {request.type} credits of serial{" "}
                        <span className="font-bold">
                          {request.serialization}
                        </span>{" "}
                        to{" "}
                        {request.toOrganizationId ??
                          middleEllipses(request.toAddress ?? "")}
                        <span className="mx-1 font-bold">·</span>{" "}
                        {formatTimeSince(new Date(request.createdAt))}{" "}
                        {formatTimeSince(new Date(request.createdAt)) ===
                        "just now"
                          ? ""
                          : "ago"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isLoadingWarehouseInventory && (
          <Loader2 className="w-5 animate-spin text-primary" />
        )}
        {!isLoadingWarehouseInventory && (
          <div className="mb-4 rounded-md bg-gray-50 p-4">
            <div className="font-medium text-gray-500">Warehouse</div>
            {warehouseError?.message}

            {!warehouseError?.message && (
              <div className="grid grid-cols-12">
                <div className="col-span-3">Serial</div>
                <div className="col-span-1">type</div>
                <div className="col-span-3">amount</div>
                <div className="col-span-3">project</div>
                <div className="col-span-2">actions</div>
                {warehouseInventory?.credits.map((inv) => {
                  return (
                    <div
                      key={inv.id}
                      className="col-span-12 mb-3 grid grid-cols-12"
                    >
                      <div className="col-span-3">{inv.serialization}</div>
                      <div className="col-span-1">{inv.type}</div>
                      <div className="col-span-3">{inv.amount}</div>
                      <div className="col-span-3">{inv.project.fullName}</div>
                      <div className="col-span-2 cursor-pointer">
                        <WarehouseInventoryCreditActionDialog
                          credit={inv}
                          trigger={<MoreVertical />}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mb-2 font-medium text-gray-500">
              Credit action requests
            </div>

            {warehouseReservations?.map((reservedCredit) => {
              return (
                <div
                  key={reservedCredit.id}
                  className={cn("mb-1 rounded-md px-3 py-2", {
                    "border border-green-500 bg-green-100":
                      reservedCredit.isComplete,
                    "border border-red-500 bg-red-100":
                      !reservedCredit.isComplete &&
                      new Date(reservedCredit.reservedToDate).getTime() <=
                        Date.now(),
                  })}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-black">
                      {reservedCredit.reserver.name}{" "}
                      <span className="font-normal text-gray-500">
                        reserved{" "}
                        <span className="font-bold">
                          {reservedCredit.amount}
                        </span>{" "}
                        {reservedCredit.type} credits of serial{" "}
                        <span className="font-bold">
                          {reservedCredit.serialization}
                        </span>{" "}
                        <span className="mx-1 font-bold">·</span>{" "}
                        {formatTimeSince(new Date(reservedCredit.createdAt))}{" "}
                        {formatTimeSince(new Date(reservedCredit.createdAt)) ===
                        "just now"
                          ? ""
                          : "ago"}
                      </span>
                    </div>
                    {!reservedCredit.isComplete &&
                      new Date(reservedCredit.reservedToDate).getTime() >
                        Date.now() && (
                        <div>
                          <div>
                            <Button
                              onClick={async () => {
                                await cancelReservation({
                                  organizationId: id as string,
                                  reservationId: reservedCredit.id,
                                });
                              }}
                              disabled={isLoadingCancel}
                              isLoading={isLoadingCancel}
                              className="mr-2"
                              size="sm"
                              variant={"outline"}
                            >
                              Cancel
                            </Button>
                            <FinishWarehouseReservationDialog
                              organizationId={id as string}
                              credit={reservedCredit}
                              trigger={
                                <Button className="" size="sm">
                                  Finish
                                </Button>
                              }
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {isLoadingRetirements && <Loader2 className="w-5 animate-spin" />}
        {!isLoadingRetirements && (
          <div className="rounded-md bg-gray-50 p-4">
            <div className="font-medium text-gray-500">Retirements</div>
            <div className="grid grid-cols-12">
              <div className="col-span-3">Serial</div>
              <div className="col-span-2">beneficiary</div>
              <div className="col-span-1">amount</div>
              <div className="col-span-2">reason</div>
              <div className="col-span-2">project</div>
              <div className="col-span-2">actions</div>
              {Array.isArray(retirements) &&
                retirements?.map((inv) => {
                  return (
                    <div
                      key={inv.id}
                      className="col-span-12 mb-3 grid grid-cols-12"
                    >
                      <div className="col-span-3">{inv.serialization}</div>
                      <div className="col-span-2">{inv.beneficiary}</div>
                      <div className="col-span-1">{inv.amount}</div>
                      <div className="col-span-2">{inv.reason}</div>
                      <div className="col-span-2">{inv.project?.fullName}</div>
                      <div className="col-span-2 cursor-pointer">
                        <DownloadRetirementButton
                          retirementId={inv.id}
                          organizationId={inv.organizationId}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
