import * as pnp from "sp-pnp-js";

export async function GetActiveUser(email: string, context): Promise<Object> {
    // try {
    //     const web = new pnp.Web(ctx.pageContext.site.absoluteUrl);
    //     var user = await web.currentUser.get();
    //     console.log("Current user : ", user);
    //     return user;
    // } catch (error) {
    //     console.log("Error in spLoggedInUserDetails : " + error);
    // }
    pnp.setup({
        spfxContext: context
    })
    return pnp.sp.site.rootWeb.ensureUser(email).then(result => {
        return result.data;
    });
}

export async function GetUserId(email: string): Promise<Number> {
    return pnp.sp.site.rootWeb.ensureUser(email).then(result => {
        return result.data.Id;
    });
}

export async function GetCurrentUser() {
    //     pnp.sp.web.currentUser.get().then((user) => {
    //         console.log(user);
    //         return user;
    //     })
    var user = this.pageContext.user;
    console.log(user);
    return user;
}