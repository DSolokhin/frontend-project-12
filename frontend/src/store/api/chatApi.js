import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Channels', 'Messages'],
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => 'channels',
      providesTags: ['Channels'],
    }),
    getMessages: builder.query({
      query: () => 'messages',
      providesTags: ['Messages'],
    }),
  }),
})

export const {
  useGetChannelsQuery,
  useGetMessagesQuery,
} = chatApi
