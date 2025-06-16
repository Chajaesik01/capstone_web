export type AuthProps = {
  onSwitch: () => void;
};

export type AuthContextType = {
  userId: string | undefined;
  setUserId: (id: string | undefined) => void;
};

export type CarbonAnalysisResult = {
  [bunji: string]: {
    [year: string]: {
      totalCarbon: number;
      totalElectricity: number;
      avgCarbon: number;
      avgElectricity: number;
      maxCarbon: number;
      minCarbon: number;
      monthCount: number;
    };
  };
}
