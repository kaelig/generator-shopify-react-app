/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type ShopifyAuthCompleteInput = {
  code: string,
  hmac: string,
  shop: string,
  state: string,
  timestamp: string,
};

export type ShopifyAuthBeginMutationVariables = {
  shop: string,
  callbackUrl: string,
  perUser: boolean,
};

export type ShopifyAuthBeginMutation = {
  shopifyAuthBegin:  {
    authUrl: string,
    token: string,
  },
};

export type ShopifyAuthCompleteMutationVariables = {
  token: string,
  params: ShopifyAuthCompleteInput,
};

export type ShopifyAuthCompleteMutation = {
  shopifyAuthComplete:  {
    token: string,
  } | null,
};
/* tslint:enable */
