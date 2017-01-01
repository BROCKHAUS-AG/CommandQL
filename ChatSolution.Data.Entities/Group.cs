using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace ChatSolution.Data.Entities
{
    public class Group : IDbEntity
    {
        public Group()
        {
            Id = Guid.NewGuid();
            CreateDate = DateTimeOffset.Now;
            Users = new List<ApplicationUser>();
        }

        [Key]
        public Guid Id { get; set; }

       
       

        [Required]
        [MaxLength(128)]
        public string Name
        {
            get;
            set;
        }

        public DateTimeOffset CreateDate { get; set; }

        public virtual List<ApplicationUser> Users { get; set; }

        static string[,] replacable = new string[,] { { "ü", "ue" }, { "ß", "ss" }, { "ö", "oe" }, { "ä", "ae" }, { " ", "_" }, { "'", "" }, { "\"", "" }, { "?", "_" }, { "&", "_" }, { ".", "_" }, { "@", "_" } };
        public static string TransformGroupName(string value)
        {
            value = value.ToLower(); //downcase, backspaces removed
            //replace                 
            for (int i = 0; i < replacable.GetLength(0); i++)
            {
                value = value.Replace(replacable[i, 0], replacable[i, 1]);
            }
            value = HttpContext.Current.Server.UrlEncode(value);
            return value;
        }
    }
}
