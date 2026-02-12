using Microsoft.AspNetCore.Http;

namespace BlazorFormApp
{
    public static class AuthHelper
    {
        /// <summary>
        /// 取得登入者員工編號
        /// 一律使用此方法取得登入者資料，不可自行改寫邏輯
        /// </summary>
        public static string GetEmpNo(IQueryCollection query)
        {
            // 從 Query String 取得員工編號
            if (query.ContainsKey("empNo"))
            {
                return query["empNo"].ToString();
            }
            
            // 如果沒有提供，可能從 Session 或其他地方取得
            // 這裡示範從 Query String 取得，實際使用時可能需要調整
            return "GUEST";
        }
    }
}
