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

        public IEnumerable<Lib_Primavera.Model.Purchase> GetPurchases(int year, int month)
        {
            return Lib_Primavera.PriIntegration.GetAllPurchases(year.ToString(), month.ToString());
        }

        /*public Lib_Primavera.Model.Purchase Get(int id)
        {
            var product = Lib_Primavera.PriIntegration.GetAllPurchases(null, null).FirstOrDefault((p) => p.Id == id.ToString());
            if (product == null)
            {
                throw new HttpResponseException(
                  Request.CreateResponse(HttpStatusCode.NotFound));
            }
            return product;
        }*/
    }
}
