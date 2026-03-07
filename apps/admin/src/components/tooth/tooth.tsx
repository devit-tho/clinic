import teeth from "@/assets/teeth";
import { selectTeethPosition } from "@/utils/tooth";
import { Button } from "@heroui/react";
import { TreatmentCoverage } from "@repo/entities";
import { CreateOrUpdateDetailType } from "@repo/schemas";
import clsx from "clsx";
import { memo, useEffect, useState } from "react";

// ----------------------------------------------------------------------

export interface ToothProps {
  isPatientInvoice?: boolean;
  tooth: number[];
  coverage?: TreatmentCoverage;
  onChangePosition: (
    position: Pick<CreateOrUpdateDetailType, "upper" | "lower" | "tooth">,
  ) => void;
}

// ----------------------------------------------------------------------

const Tooth: React.FC<ToothProps> = ({
  isPatientInvoice = false,
  tooth = [],
  coverage = TreatmentCoverage.NONE,
  onChangePosition,
}) => {
  const [position, setPosition] = useState<number[]>(tooth);

  const topPosition = selectTeethPosition(teeth, "top");
  const bottomPosition = selectTeethPosition(teeth, "bottom");

  const patientInvoiceCondition =
    (isPatientInvoice && coverage === TreatmentCoverage.PARTIAL) ||
    coverage === TreatmentCoverage.FULL;

  const treatmentCondition =
    (!isPatientInvoice && coverage === TreatmentCoverage.NONE) ||
    coverage === TreatmentCoverage.FULL;

  useEffect(() => {
    setPosition(tooth);
  }, [tooth]);

  function handleClickTooth(val: number) {
    const newPosition = position.includes(val)
      ? position.filter((v) => v !== val)
      : [...position, val];

    setPosition(newPosition);

    const newTopTeeth = topPosition.filter((t) => newPosition.includes(t));
    const newBottomTeeth = bottomPosition.filter((t) =>
      newPosition.includes(t),
    );

    onChangePosition({
      lower: newBottomTeeth.length,
      upper: newTopTeeth.length,
      tooth: newPosition,
    });
  }

  return (
    <div className="flex flex-wrap gap-x-2 rounded-md border border-foreground-200">
      {teeth.map((data, ind) => (
        <div key={data.position} className="flex">
          <div
            className={clsx(
              "flex flex-col lg:flex-row border-foreground-200",
              ind === 0 && "border-b",
            )}
          >
            {data.items.map((item, i) => (
              <div
                key={item.position}
                className={clsx(
                  "flex gap-x-0.5 border-foreground-200",
                  i === 0 && "border-r",
                )}
              >
                {item.values.map((value) => (
                  <ToothButton
                    key={value.tooth}
                    image={value.image}
                    isActive={position.includes(value.tooth)}
                    tooth={value.tooth}
                    position={data.position}
                    onPress={() => handleClickTooth(value.tooth)}
                    isCoverage={
                      isPatientInvoice
                        ? patientInvoiceCondition
                        : treatmentCondition
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tooth;

const ToothButton = memo(
  ({
    tooth,
    position,
    image,
    isActive,
    onPress,
    isCoverage,
  }: {
    tooth: number;
    position: "top" | "bottom";
    image: string;
    isActive: boolean;
    onPress: () => void;
    isCoverage?: boolean;
  }) => (
    <>
      <div
        className={clsx(
          "flex items-center gap-y-1.5 py-3.5",
          position === "top" ? "flex-col" : "flex-col-reverse",
        )}
      >
        <img
          src={image}
          alt="tooth"
          className="scale-125"
          width={128}
          height={128}
        />
        <Button
          isIconOnly
          size="sm"
          radius="full"
          color={isActive ? "primary" : "default"}
          variant={isActive ? "solid" : "light"}
          onPress={onPress}
          isDisabled={isCoverage}
          disabled={isCoverage}
        >
          {tooth}
        </Button>
      </div>
    </>
  ),
);
