import { client, clientWithToken } from "./client";

const GenreURL = 'genre/';

export const getAllGenres = () => {
    return client().get(GenreURL + 'findAll');
};

export const registMemberGenres=(selectedGenre)=>{
    return clientWithToken().post(GenreURL+'member/check',selectedGenre);
};

export const getMyGenres=()=>{
  return clientWithToken().get(GenreURL+'get/member/check');
};