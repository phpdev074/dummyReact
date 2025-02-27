import CssBaseline from "@mui/material/CssBaseline";
import Router from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConfigData } from "redux/slices/configData";
import MainLayout from "../../src/components/layout/MainLayout";
import ModuleWiseLayout from "../../src/components/module-wise-layout";
import ZoneGuard from "../../src/components/route-guard/ZoneGuard";
// import { getServerSideProps } from "../index";
import SEO from "../../src/components/seo";
import { getImageUrl } from "utils/CustomFunctions";

const Home = ({ configData, landingPageData }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (configData) {
      if (configData.length === 0) {
        Router.push("/404");
      } else if (configData?.maintenance_mode) {
        Router.push("/maintainance");
      } else {
        dispatch(setConfigData(configData));
      }
    } else {
    }
  }, [configData]);
  let language_direction = undefined;
  if (typeof window !== "undefined") {
    language_direction = localStorage.getItem("language-setting");
  }

  return (
    <>
      <CssBaseline />
      {configData && (
        <SEO
          title="Home"
          image={configData?.fav_icon_full_url}
          businessName={configData?.business_name}
          configData={configData}
        />
      )}

      <MainLayout configData={configData} landingPageData={landingPageData}>
        <ModuleWiseLayout configData={configData} />
      </MainLayout>
    </>
  );
};

export default Home;

Home.getLayout = (page) => <ZoneGuard>{page}</ZoneGuard>;

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const language = req.cookies.languageSetting;

  const configRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        "X-localization": language,
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );
  const config = await configRes.json();
  const landingPageRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/react-landing-page`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        "X-localization": language,
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );
  const landingPageData = await landingPageRes.json();
  // Set cache control headers for 1 hour (3600 seconds)
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate"
  );

  return {
    props: {
      configData: config,
      landingPageData: landingPageData,
    },
  };
};
