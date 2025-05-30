export type AuthProps = {
  onSwitch: () => void;
};

export type AuthContextType = {
  userId: string | undefined;
  setUserId: (id: string | undefined) => void;
};
