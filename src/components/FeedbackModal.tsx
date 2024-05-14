import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Img,
    Tooltip,
    HStack,
    Spacer,
    Button,
    ModalProps,
    ModalContentProps,
  
  } from "@chakra-ui/react";
  
  import { InfoIcon } from "@chakra-ui/icons";
  
  export type ModalActionButtonProps = {
    text: string;
    action: () => void;
    iconSrc?: string;
    tooltipText?: string;
    loading?: boolean;
    isDisabled?: boolean;
  }
  
  interface ModContainerProps extends ModalContentProps {
    onClose: () => void;
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    footerText?: string;
    actionButtonProps?: ModalActionButtonProps | undefined;
    hasCancelButton?: boolean;
    hideButtons?: boolean;
  };
  
  export const ModalContainer = ({ onClose, isOpen, title, footerText, children, actionButtonProps, hasCancelButton, hideButtons = false, ...props }: ModContainerProps) => {
    return (
      <Modal  isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent {...props} minW={{ base: "inherit", md: "582px" }}>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {children}
            <Spacer h="32px" />
            <HStack hidden={hideButtons} justifyContent="center">
              {actionButtonProps ?
                <>
                  <Button
                    variant={'solidLight'}
                    leftIcon={actionButtonProps.iconSrc ? <Img w="2em" h="2em" src={actionButtonProps.iconSrc} ml="-5px" /> : undefined}
                    onClick={actionButtonProps.action}
                    isLoading={actionButtonProps.loading}
                    isDisabled={actionButtonProps.loading || actionButtonProps.isDisabled}
                    rightIcon={actionButtonProps.tooltipText ?
                      <Tooltip label={actionButtonProps.tooltipText} >
                        <InfoIcon />
                      </Tooltip>
                      :
                      undefined
                    }
                    //w="165px"
                  >
                    {actionButtonProps.text}
                  </Button>
                  {hasCancelButton &&
                    <Button onClick={onClose} variant={'outlinedStake'} p={'15px 24px'} w="165px">{'CANCEL'}</Button>
                  }
                </>
                :
                <Button variant={'outlinedStake'} onClick={onClose} height="48px" w="165px">{'CLOSE'}</Button>
              }
            </HStack>
          </ModalBody>
          <ModalFooter>{footerText ?? ''}</ModalFooter>
        </ModalContent>
      </Modal>
    );
  };