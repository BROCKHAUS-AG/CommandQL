using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
//using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using System.Linq;
using System.ComponentModel;

namespace ChatSolution.Data.Entities
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    //TODO: PM Status
    [Description("IdentityUser remove")]
    public class IdentityUser { public string Id { get; set; } public string UserName { get; set; }}
    /// <summary>
    ///     The application user.
    /// </summary>

    public class ApplicationUser : IdentityUser, IDbEntity  //TODO:PM
    {
        /// <summary>
        ///     Gets or sets the display name.
        /// </summary>
        [StringLength(250)]
        public string Displayname { get; set; }

        /// <summary>
        ///     Gets or sets the support categories.
        /// </summary>
        public virtual ICollection<SupportCategory> SupportCategories { get; set; }

        /// <summary>
        /// Gets or sets the profile image.
        /// </summary>
        [JsonIgnore]
        public byte[] ProfileImage { get; set; }

        /// <summary>
        /// Gets or sets the profile image extension.
        /// </summary>
        [JsonIgnore]
        [MaxLength(10)]
        public string ProfileImageExtension { get; set; }


        [NotMapped]
        public List<string> Keywords
        {
            get { return KeywordsJson == null ? null : JsonConvert.DeserializeObject<List<string>>(KeywordsJson); }
            set { KeywordsJson = JsonConvert.SerializeObject(value); }
        }

        /// <summary>
        ///     Gets or sets the stored list of keywords
        /// </summary>
        [JsonIgnore]
        [MaxLength(2000)]
        public string KeywordsJson { get; set; }


        [MaxLength(128)]
        public string Company { get; set; }  //#

        [MaxLength(128)]
        public string Department { get; set; } //#

        [MaxLength(128)]
        public string Position { get; set; } //#

        public virtual Group Group { get; set; } //# groupresolver attr7

        /// <summary>
        ///     Gets the path for the profile image.
        /// </summary>
        /// <returns>
        ///     The path to the users profile image as <see cref="string" />.
        /// </returns>
        [NotMapped]
        public string ProfileImagePath
        {
            get { return GetProfileImagePath(); }
        }

        ///// <summary>
        ///// Gets the current application user by name from DB.
        ///// </summary>
        ///// <param name="principal">
        ///// The principal.
        ///// </param>
        ///// <returns>
        ///// The <see cref="ApplicationUser"/> or a new <see cref="ApplicationUser"/> with Displayname "Anonymous".
        ///// </returns>
        //public static ApplicationUser GetCurrentApplicationUser(IPrincipal principal)
        //{
        //    return GetCurrentApplicationUser(
        //        principal,
        //        new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext())));
        //}

        ///// <summary>
        ///// Gets the current application user by name from DB.
        ///// </summary>
        ///// <param name="principal">
        ///// The principal.
        ///// </param>
        ///// <param name="userManager">
        ///// The user manager.
        ///// </param>
        ///// <returns>
        ///// The <see cref="ApplicationUser"/> or a new <see cref="ApplicationUser"/> with Displayname "Anonymous".
        ///// </returns>
        //public static ApplicationUser GetCurrentApplicationUser(IPrincipal principal, UserManager<ApplicationUser> userManager)
        //{
        //    ApplicationUser result = null;
        //    if (principal != null && userManager != null)
        //    {
        //        string userName = principal.Identity.Name;
        //        result = userManager.FindByName(userName);
        //    }

        //    return result ?? (new ApplicationUser { Displayname = "Anonymous" });
        //}

        ///// <summary>
        ///// The generate user identity async.
        ///// </summary>
        ///// <param name="manager">
        ///// The manager.
        ///// </param>
        ///// <returns>
        ///// The <see cref="Task"/>.
        ///// </returns>
        //public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        //{
        //    // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
        //    ClaimsIdentity userIdentity =
        //        await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);

        //    // Add custom user claims here
        //    return userIdentity;
        //}

        /// <summary>
        /// Gets the path for the profile image.
        /// </summary>
        /// <returns>
        /// The path to the users profile image as <see cref="string"/>.
        /// </returns>
        public string GetProfileImagePath()
        {
            var path = "Content/Images/User/" + (Id??"default").ToString() + ".png";
            return path; //.Replace("", requestUri.GetBaseUrl());
        }

        Guid IDbEntity.Id
        {
            get
            {
                return Guid.Parse(this.Id);
            }
            set
            {
                this.Id = value.ToString("B");
            }
        }
    }
}