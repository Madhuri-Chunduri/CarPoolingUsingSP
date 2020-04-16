import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'CarPoolingWebPartStrings';
import CarPooling from './components/CarPooling';
import TopNavigationBar from "./components/TopNavigationBar";
import { ICarPoolingProps } from './components/ICarPoolingProps';
import OfferRideComponent from './components/OfferRideComponent';
import { GetActiveUser } from './services/UtilityService';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

export interface ICarPoolingWebPartProps {
}

export default class CarPoolingWebPart extends BaseClientSideWebPart<ICarPoolingWebPartProps> {

  public async render(): Promise<void> {
    var activeUser = await GetActiveUser(this.context.pageContext.user.email, this.context);
    localStorage.setItem("currentUser", JSON.stringify(activeUser));

    //var user = sp.web.currentUser;
    //console.log(user);
    const element: React.ReactElement<ICarPoolingProps> = React.createElement(
      TopNavigationBar
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
