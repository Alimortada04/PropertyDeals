import { useEffect, useState } from "react";
import { PropertyCreationModal } from "@/components/seller/property-creation-modal";
import { OffersInboxModal } from "@/components/seller/offers-inbox-modal";
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
      <PropertyCreationModal 
        isOpen={propertyModal.isOpen} 
        onClose={propertyModal.onClose} 
      />
      <OffersInboxModal
        isOpen={offersInboxModal.isOpen}
        onClose={offersInboxModal.onClose}
      />
      <CampaignCreationModal
        isOpen={campaignModal.isOpen}
        onClose={campaignModal.onClose}
      />
    </>
  );
};