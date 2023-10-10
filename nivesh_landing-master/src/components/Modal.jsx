import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { motion } from 'framer-motion';
const ModalPopup = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { content, header, open, close, trigger } = props;

  const handleModalOpen = () => {
    if(open && typeof open === "function"){
        open();
    }
    onOpen();
  }

  const handleModalClose = () => {
    if(close && typeof close === "function"){
        close();
    }
    onClose();
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: -100,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <Button 
        rounded={"full"} px={6} variant="outline"
        onClick={handleModalOpen}
      >
      {trigger}
      </Button>
      <motion.div initial="hidden" animate={isOpen ? "visible" : "hidden"} variants={modalVariants}>
        <Modal isOpen={isOpen} onClose={handleModalClose} isCentered size='lg'
        scrollBehavior={'inside'}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{header}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {content}
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleModalClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
      </motion.div>
    </>
  );
};

export default ModalPopup;
