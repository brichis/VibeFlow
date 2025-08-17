import { useCallback } from "react";
import { notification } from "~~/utils/scaffold-eth";

type TransactionFunc = (tx: () => Promise<any>) => Promise<any>;

/**
 * Custom notification content for TXs.
 */
const TxnNotification = ({ message }: { message: string }) => {
  return (
    <div className={`flex flex-col ml-1 cursor-default`}>
      <p className="my-0">{message}</p>
    </div>
  );
};

/**
 * Simplified transactor hook for Dynamic SDK integration
 * @returns function that takes in transaction function as callback, shows UI feedback for transaction
 */
export const useTransactor = (): TransactionFunc => {
  const result: TransactionFunc = async (tx) => {
    let notificationId = null;
    
    try {
      notificationId = notification.loading(<TxnNotification message="Awaiting for user confirmation" />);
      
      // Execute the transaction
      const result = await tx();
      
      notification.remove(notificationId);
      
      notificationId = notification.loading(<TxnNotification message="Waiting for transaction to complete." />);
      
      // Simulate waiting for confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      notification.remove(notificationId);
      
      notification.success(
        <TxnNotification message="Transaction completed successfully!" />,
        {
          icon: "🎉",
        },
      );
      
      return result;
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      
      console.error("⚡️ ~ file: useTransactor.tsx ~ error", error);
      const message = error?.message || "Transaction failed";
      
      notification.error(message);
      throw error;
    }
  };

  return result;
};
