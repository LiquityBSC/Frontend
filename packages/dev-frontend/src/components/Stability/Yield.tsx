import React, { useEffect, useState } from "react";
import { Card, Paragraph, Text } from "theme-ui";
import { Decimal, LiquityStoreState } from "@liquity/lib-base";
import { useLiquitySelector } from "@liquity/lib-react";
import { InfoIcon } from "../InfoIcon";
import { useLiquity } from "../../hooks/LiquityContext";
import { Badge } from "../Badge";
import { fetchLqtyPrice } from "./context/fetchLqtyPrice";

import { ethers } from "ethers";

const selector = ({ lusdInStabilityPool, remainingStabilityPoolLQTYReward }: LiquityStoreState) => ({
  lusdInStabilityPool,
  remainingStabilityPoolLQTYReward
});

export const Yield: React.FC = () => {
  const {
    meContract,
    account,
    liquity: {
      connection: { addresses }
    }
  } = useLiquity();
  
  const { lusdInStabilityPool, remainingStabilityPoolLQTYReward } = useLiquitySelector(selector);

  const [lqtyPrice, setLqtyPrice] = useState<Decimal | undefined>(undefined);
  const hasZeroValue = remainingStabilityPoolLQTYReward.isZero || lusdInStabilityPool.isZero;
  const lqtyTokenAddress = addresses["lqtyToken"];

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { lqtyPriceUSD } = await fetchLqtyPrice(lqtyTokenAddress);
  //       setLqtyPrice(lqtyPriceUSD);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // }, [lqtyTokenAddress]);

  useEffect(() => {
    // meContract.contractEth.getAmountsOut(ethers.utils.parseUnits('1',18),[lqtyTokenAddress,'0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c','0x55d398326f99059ff775485246999027b3197955']).then((res:any) => {
    //   setLqtyPrice(Decimal.fromBigNumberString(res[2]))
    // })
  }, []);

  if (hasZeroValue || lqtyPrice === undefined) return null;

  const yearlyHalvingSchedule = 0.5; // 50% see LQTY distribution schedule for more info
  const remainingLqtyOneYear = remainingStabilityPoolLQTYReward.mul(yearlyHalvingSchedule);
  const remainingLqtyInUSD = remainingLqtyOneYear.mul(lqtyPrice);
  const aprPercentage = remainingLqtyInUSD.div(lusdInStabilityPool).mul(100);

  if (aprPercentage.isZero) return null;

  return (
    <Badge>
      <Text>LBSC APR {aprPercentage.toString(2)}%</Text>
      <InfoIcon
        tooltip={
          <Card variant="tooltip" sx={{ width: ["220px", "518px"] }}>
            <Paragraph>
              An <Text sx={{ fontWeight: "bold" }}>estimate</Text> of the LBSC return on the FUSD
              deposited to the Stability Pool over the next year, not including your BNB gains from
              liquidations.
            </Paragraph>
            <Paragraph sx={{ fontSize: "12px", fontFamily: "monospace", mt: 2 }}>
              (($LQTY_REWARDS * YEARLY_DISTRIBUTION%) / DEPOSITED_LUSD) * 100 ={" "}
              <Text sx={{ fontWeight: "bold" }}> APR</Text>
            </Paragraph>
            <Paragraph sx={{ fontSize: "12px", fontFamily: "monospace" }}>
              ($
              {remainingLqtyInUSD.shorten()} * 50% / ${lusdInStabilityPool.shorten()}) * 100 =
              <Text sx={{ fontWeight: "bold" }}> {aprPercentage.toString(2)}%</Text>
            </Paragraph>
          </Card>
        }
      ></InfoIcon>
    </Badge>
  );
};
