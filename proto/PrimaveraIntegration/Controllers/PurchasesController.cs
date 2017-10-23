using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PrimaveraIntegration.Lib_Primavera.Model;

namespace PrimaveraIntegration.Controllers
{
    public class PurchasesController : ApiController
    {
        // GET api/purchases   
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases()
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(null, null);
        }

        // GET api/purchases/date/{year}
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(int year)
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(year.ToString(), null);
        }

        // GET api/purchases/date/{year}/{month}
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(int year, int month)
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(year.ToString(), month.ToString());
        }

        // GET api/purchases?initial={yyyy-mm-dd}&final={yyyy-mm-dd}
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(DateTime initial, DateTime final)
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(initial.ToString("yyyy-MM-dd"), final.ToString("yyyy-MM-dd"), null);
        }

        // GET api/purchases?initial={yyyy-mm-dd}&final={yyyy-mm-dd}&supplier={supplier}
        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(DateTime initial, DateTime final, string supplier)
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(initial.ToString("yyyy-MM-dd"), final.ToString("yyyy-MM-dd"), supplier);
        }
    }
}
