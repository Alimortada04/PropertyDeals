import { useEffect, useState } from "react";
import { EnhancedPropertyListingModal } from "@/components/property/enhanced-property-listing-modal";
import { OffersInboxModal } from "@/components/seller/offers-inbox-modal-streamlined";
import { MarketingCenterModal } from "@/components/seller/marketing-center-modal";
import { usePropertyModal } from "@/hooks/use-property-modal";
import { useOffersInboxModal } from "@/hooks/use-offers-inbox-modal";
import { useMarketingCenterModal } from "@/hooks/use-marketing-center-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  const propertyModal = usePropertyModal();
  const offersInboxModal = useOffersInboxModal();
  const marketingCenterModal = useMarketingCenterModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <EnhancedPropertyListingModal 
        isOpen={propertyModal.isOpen} 
        onClose={propertyModal.onClose} 
      />
      <OffersInboxModal
        isOpen={offersInboxModal.isOpen}
        onClose={offersInboxModal.onClose}
        preSelectedPropertyId={offersInboxModal.preSelectedPropertyId}
      />
      <MarketingCenterModal
        isOpen={marketingCenterModal.isOpen}
        onClose={marketingCenterModal.onClose}
      />
    </>
  );
};