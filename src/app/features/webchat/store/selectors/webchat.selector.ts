import {WebchatState} from "../reducers/index.reducer";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {create} from "lodash";
import {UserInterface} from "../../interfaces/user.interface";

const featureSelector = createFeatureSelector <WebchatState> ( 'webchat' );

export const selectUsers = createSelector(featureSelector, (state: WebchatState) => state.users);
export const selectCurrentChat = createSelector(featureSelector, (state: WebchatState) => state.currentChat);

export const selectUserById = createSelector(selectUsers, (users: UserInterface[], props: { id: number}) => users.find(u => u.id == props.id));

export const selectUserByName = (props: { name: string}) =>
  createSelector(selectUsers, (users: UserInterface[]) => {

    console.log(props.name, users)
    return users.find(u => u.username == props.name)
  })

export const areUsersLoaded = createSelector(featureSelector, (state: WebchatState) => state.usersLoaded);
