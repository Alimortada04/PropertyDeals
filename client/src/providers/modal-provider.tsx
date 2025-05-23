import { useEffect, useState } from "react";
import { EnhancedPropertyListingModal } from "@/components/property/enhanced-property-listing-modal";
import { OffersInboxModal } from "@/components/seller/offers-inbox-modal-streamlined";
import { CampaignCreationModal } from "@/components/seller/campaign-creation-modal";
import { usePropertyModal } from "@/hooks/use-property-modal";
import { useOffersInboxModal } from "@/hooks/use-offers-inbox-modal";
import { useCampaignModal } from "@/hooks/use-campaign-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  const propertyModal = usePropertyModal();
  const offersInboxModal = useOffersInboxModal();
  const campaignModal = useCampaignModal();

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
      <CampaignCreationModal
        isOpen={campaignModal.isOpen}
        onClose={campaignModal.onClose}
      />
    </>
  );
};