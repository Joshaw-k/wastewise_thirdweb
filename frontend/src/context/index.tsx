import localforage from "localforage";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { WASTEWISE_ADDRESS, WasteWiseABI } from "../../constants";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";

type contextType = {
  wastewiseStore: any;
  isRegistered: boolean;
  currentUser: any;
  setCurrentUser: any;
  statistics: any;
  setStatistics: any;
  notifCount: number | any;
  setNotifCount: number | any;
  notifications: any;
  setNotifications: any;
};

type userDataType = {
  approvalCount: number;
  country: string;
  email: string;
  gender: number;
  id: number;
  isAdmin: boolean;
  name: string;
  phoneNo: number;
  referral: string;
  role: number;
  timeJoined: number;
  tokenQty: number;
  userAddr: string;
};

const WastewiseContext = createContext<contextType>({
  wastewiseStore: null,
  isRegistered: false,
  currentUser: null,
  setCurrentUser: null,
  statistics: null,
  setStatistics: null,
  notifCount: 0,
  setNotifCount: 0,
  notifications: null,
  setNotifications: null,
});

const WastewiseProvider = ({ children }: { children: ReactNode }) => {
  localforage.config({
    driver: [
      localforage.INDEXEDDB,
      localforage.WEBSQL,
      localforage.LOCALSTORAGE,
    ],
    name: "Wastewise-App",
  });
  let wastewiseStore = localforage.createInstance({
    name: "wastewiseStore",
  });

  // const { isConnected } = useAccount();
  const address = useAddress();

  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<userDataType | {}>({});
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState<any>([]);
  const [statistics, setStatistics] = useState<any>({});

  //   useEffect(() => {
  // }, [wastewiseStore.length()]);
  wastewiseStore
    .length()
    .then(function (nKeys) {
      //   console.log(nKeys);
      setNotifCount(nKeys);
    })
    .catch(function (err) {
      console.log("Error fetching store length: ", err);
    });

  const fetchNotifications = useCallback(() => {
    wastewiseStore
      .iterate(function (value, key, iterNumber) {
        if (notifCount >= notifications.length) {
          // Notification has been deleted, remove it not add it.
          // setNotifications(notifications.filter((item) => item.id !== 'John'))
          // console.log(value);
          setNotifications([...notifications, value]);
        }
        return value;
      })
      .then(function (result) {
        // console.log(result);
      })
      .catch(function (err) {
        // If there are errors when setting alerts
        console.log(err);
      });
  }, [notifCount]);

  useEffect(() => {
    fetchNotifications();
  }, [notifCount]);

  const { contract } = useContract(WASTEWISE_ADDRESS, WasteWiseABI);

  const {
    data: getUserData,
    isLoading,
    error,
  } = useContractRead(contract, "getUser", [], { from: address });

  // if (getUserData) {
  //   setIsRegistered(
  //     getUserData ? Number((getUserData as any)?.userAddr) !== 0 : false
  //   );
  // }

  // const { data } = useContractRead({
  //   address: WASTEWISE_ADDRESS,
  //   abi: WasteWiseABI,
  //   functionName: "getUser",
  //   // args: [address],
  //   account: address,
  //   enabled: true,
  //   // onSuccess(data) {
  //   //   setIsRegistered(data ? Number((data as any)?.userAddr) !== 0 : false);
  //   // },
  // });

  // console.log(data);

  const { data: getStatistics } = useContractRead(
    contract,
    "getStatistics",
    [],
    { from: address }
  );

  // if (getStatistics) {
  // setStatistics(getStatistics as any);
  // }
  // const statisticsRead = useContractRead({
  //   address: WASTEWISE_ADDRESS,
  //   abi: WasteWiseABI,
  //   functionName: "getStatistics",
  //   account: address,
  //   onSuccess(data) {
  //     setStatistics(data as any);
  //   },
  // });

  console.log(getUserData);

  useEffect(() => {
    setIsRegistered(
      getUserData ? Number((getUserData as any)?.userAddr) !== 0 : false
    );
    setCurrentUser(getUserData as any);
    return () => {};
  }, [getUserData, isRegistered]);

  useEffect(() => {
    setStatistics(getStatistics);
  }, [getStatistics]);

  return (
    <WastewiseContext.Provider
      value={{
        wastewiseStore,
        isRegistered,
        currentUser,
        setCurrentUser,
        statistics,
        setStatistics,
        notifCount,
        setNotifCount,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </WastewiseContext.Provider>
  );
};

export const useWasteWiseContext = () => useContext(WastewiseContext);
export default WastewiseProvider;
