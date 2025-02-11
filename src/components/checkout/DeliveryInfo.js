import React, { useState } from "react";
import { alpha, IconButton, Stack, Typography, useTheme } from "@mui/material";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";

import DeliveryInfoCard from "./DeliveryInfoCard";
import CustomImageContainer from "../CustomImageContainer";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../modal";
import CloseIcon from "@mui/icons-material/Close";
import DeliveryInstruction from "./DeliveryInstruction";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { getToken } from "helper-functions/getToken";
import { useSelector } from "react-redux";
import { getImageUrl } from "utils/CustomFunctions";

const DeliveryInfo = ({
  configData,
  deliveryInstruction,
  customerInstruction,
  setCustomerInstruction,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedInstruction, setSelectedInstruction] = useState(null);
  const [customNote, setCustomNote] = useState("");
  const token = getToken();
  const { parcelInfo } = useSelector((state) => state.parcelInfoData);
  const handleClick = () => {
    setOpenModal(!openModal);
  };
  const handleRemoveInstruction = () => {
    setCustomerInstruction(null);
    setSelectedInstruction(null);
    // setCustomNote("");
  };
  const handleRemoveInstructionDes = () => {
    setCustomNote("");
  };
  return (
    <CustomPaperBigCard>
      <CustomStackFullWidth spacing={3}>
        <Stack align="center">
          <Typography fontWeight={500} fontSize="16px">
            {t("Delivery Information")}
          </Typography>
        </Stack>
        <DeliveryInfoCard
          title={t("Sender")}
          phone={
            token ? parcelInfo?.senderPhone : `+ ${parcelInfo?.senderPhone}`
          }
          name={parcelInfo?.senderName}
          address={parcelInfo?.senderAddress}
        />
        <DeliveryInfoCard
          title={t("Receiver")}
          phone={`+ ${parcelInfo?.receiverPhone}`}
          name={parcelInfo?.receiverName}
          address={parcelInfo?.receiverAddress}
        />
        <CustomStackFullWidth spacing={0.5}>
          <Stack width="100%">
            <Typography fontWeight="500">{t("Parcel Category")}</Typography>
          </Stack>
          <Stack
            width="100%"
            padding="1.3rem"
            backgroundColor={theme.palette.neutral[300]}
            borderRadius="7px"
            spacing={2}
            direction="row"
            alignItems="center"
          >
            <CustomImageContainer
              width="50px"
              height="50px"
              src={parcelInfo?.parcel_category_image_full_url}
              objectfit="contain"
            />
            <Stack>
              <Typography
                fontSize={{ xs: "14px", sm: "16px", md: "16px" }}
                fontWeight="500"
              >
                {parcelInfo?.name}
              </Typography>
              <Typography color={theme.palette.neutral[500]} fontSize="12px">
                {parcelInfo?.description}
              </Typography>
            </Stack>
          </Stack>
        </CustomStackFullWidth>
        <CustomStackFullWidth>
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontSize="16px" fontWeight="500">
              {t("Add More Delivery Instruction")}
            </Typography>
            <IconButton>
              <AddIcon fontSize="medium" onClick={handleClick} />
            </IconButton>
          </Stack>
          <Stack>
            {customerInstruction && (
              <Stack direction="row" gap="10px" justifyContent="flex-start">
                <MeetingRoomIcon sx={{ color: theme.palette.primary.main }} />
                <Stack
                  gap="5px"
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Typography
                    fontSize="12px"
                    fontWeight={400}
                    color={theme.palette.primary.main}
                  >
                    {selectedInstruction}
                  </Typography>
                  <Stack
                    justifyContent="flex-start"
                    sx={{ cursor: "pointer" }}
                    pr="20px"
                  >
                    <CloseIcon
                      fontSize="18px"
                      onClick={handleRemoveInstruction}
                    />
                  </Stack>
                </Stack>
              </Stack>
            )}
            {customNote && (
              <Stack
                gap="5px"
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Typography
                  fontSize="12px"
                  fontWeight={400}
                  color={alpha(theme.palette.neutral[600], 0.7)}
                >
                  {customNote}
                </Typography>
                <Stack
                  justifyContent="flex-start"
                  sx={{ cursor: "pointer" }}
                  pr="20px"
                >
                  <CloseIcon
                    fontSize="18px"
                    onClick={handleRemoveInstructionDes}
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
          <CustomModal
            openModal={openModal}
            handleClose={() => setOpenModal(false)}
          >
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ position: "relative" }}
            >
              <IconButton
                onClick={() => setOpenModal(false)}
                sx={{
                  zIndex: "99",
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: (theme) => theme.palette.neutral[100],
                  borderRadius: "50%",
                  [theme.breakpoints.down("md")]: {
                    top: 10,
                    right: 5,
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: "24px", fontWeight: "500" }} />
              </IconButton>
            </CustomStackFullWidth>
            <DeliveryInstruction
              setOpenModal={setOpenModal}
              deliveryInstruction={deliveryInstruction}
              setCustomerInstruction={setCustomerInstruction}
              selectedInstruction={selectedInstruction}
              setSelectedInstruction={setSelectedInstruction}
              customNote={customNote}
              setCustomNote={setCustomNote}
            />
          </CustomModal>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    </CustomPaperBigCard>
  );
};

export default DeliveryInfo;
