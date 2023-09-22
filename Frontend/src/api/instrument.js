import { client,clientWithToken } from "./client";

const InstrumentURL = 'instrument/';

export const getAllInstruments = () => {
    return client().get(InstrumentURL + 'findAll');
};

export const registMemberInstruments=(selectedInstruments)=>{
    return clientWithToken().post(InstrumentURL+'member/check',selectedInstruments);
};

export const getMyInstruments=()=>{
  return clientWithToken().get(InstrumentURL+'get/member/check');
};