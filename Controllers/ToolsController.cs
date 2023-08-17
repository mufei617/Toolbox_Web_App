using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using app.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System.IO;
using Onvif.DeviceManagement;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp;

namespace app.Controllers
{
    public class ToolsController : BaseController
    {
        private readonly VideoProcessService _videoProcessService;
        private readonly IMemoryCache _responseCache;
        private readonly ILogger<ToolsController> _logger;

        public ToolsController(VideoProcessService videoProcessService, IMemoryCache responseCache, ILogger<ToolsController> logger)
        {
            _videoProcessService = videoProcessService;
            _responseCache = responseCache;
            _logger = logger;
        }

        [HttpPost("convertvideo")]
        public async Task<IActionResult> ProcessVideo(IFormFile inputVideo)
        {
            try
            {
                if (inputVideo == null || inputVideo.Length == 0)
                {
                    return BadRequest("输入文件不能为空");
                }

                var videoData = await _videoProcessService.ProcessVideoAsync(inputVideo);

                if (videoData != null && videoData.Length > 0)
                {
                    return File(videoData, "video/avi", "processed_video.avi");
                }

                return BadRequest("Video processing failed.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing the video.");
                return StatusCode(500, "Internal server error:");
            }
        }

        [HttpPost("trimcrop")]
        public async Task<IActionResult> TrimAndCropVideo(IFormFile inputVideo, TimeSpan startTime, TimeSpan endTime, int cropX, int cropY, int cropWidth, int cropHeight)
        {
            try
            {
                if (inputVideo == null || inputVideo.Length == 0)
                {
                    return BadRequest("No video file uploaded.");
                }

                string tempInputVideoFilePath = Path.GetTempFileName();
                using (var fileStream = new FileStream(tempInputVideoFilePath, FileMode.Create))
                {
                    await inputVideo.CopyToAsync(fileStream);
                }

                var videoData = await _videoProcessService.TrimAndCropVideoAsync(tempInputVideoFilePath, startTime, endTime, cropX, cropY, cropWidth, cropHeight);

                System.IO.File.Delete(tempInputVideoFilePath);

                if (videoData != null && videoData.Length > 0)
                {
                    return File(videoData, "video/mp4", "trimmed_and_cropped_video.avi");
                }
                else
                {
                    return BadRequest("Video trimming and cropping failed.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while trimming and cropping the video.");
                return StatusCode(500, "Internal server error");
            }
        }

        // [HttpGet("live")]
        // public async Task<IActionResult> GetLiveStream()
        // {
        //     try
        //     {
        //         string deviceIp = "192.168.2.46";
        //         string devicePort = "554";
        //         string username = "admin";
        //         string password = "449685";
        //         string profileRequest = $@"
        //             <s:Envelope xmlns:s='http://www.w3.org/2003/05/soap-envelope'
        //                         xmlns:tds='http://www.onvif.org/ver10/media/wsdl'>
        //                 <s:Header>
        //                     <tds:Security>
        //                         <UsernameToken>
        //                             <Username>{username}</Username>
        //                             <Password>{password}</Password>
        //                         </UsernameToken>
        //                     </tds:Security>
        //                 </s:Header>
        //                 <s:Body>
        //                     <tds:GetProfiles />
        //                 </s:Body>
        //             </s:Envelope>";

        //         const int requestTimeoutSeconds = 1000;
        //         // string cacheKey = "live_stream_response";

        //         // if (_responseCache.TryGetValue(cacheKey, out string cachedResponse))
        //         // {
        //         //     return Ok(cachedResponse);
        //         // }

        //         using var httpClient = new HttpClient(new HttpClientHandler { UseProxy = false, MaxConnectionsPerServer = 100 })
        //         {
        //             Timeout = TimeSpan.FromSeconds(requestTimeoutSeconds)
        //         };

        //         var httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, $"http://{deviceIp}:{devicePort}/onvif/Media");
        //         httpRequestMessage.Headers.Add("SOAPAction", "http://www.onvif.org/ver10/media/wsdl/GetProfiles");
        //         httpRequestMessage.Content = new StringContent(profileRequest, Encoding.UTF8, "application/soap+xml");

        //         _logger.LogInformation("开始连接到设备...");
        //         var profileResponse = await httpClient.SendAsync(httpRequestMessage);
        //         _logger.LogInformation("设备连接完成."); profileResponse.EnsureSuccessStatusCode();

        //         string profileSoapResponse = await profileResponse.Content.ReadAsStringAsync();

        //         XDocument profileSoapXml = XDocument.Parse(profileSoapResponse);
        //         XNamespace profileNs = "http://www.onvif.org/ver10/media/wsdl";
        //         var profileTokens = profileSoapXml.Descendants(profileNs + "Profiles").Elements(profileNs + "token").Select(token => token.Value);
        //         string profileToken = profileTokens.FirstOrDefault();

        //         string rtspUriRequest = $@"
        //                 <s:Envelope xmlns:s='http://www.w3.org/2003/05/soap-envelope'
        //                             xmlns:tds='http://www.onvif.org/ver10/media/wsdl'>
        //                     <s:Header>
        //                         <tds:Security>
        //                             <UsernameToken>
        //                                 <Username>{username}</Username>
        //                                 <Password>{password}</Password>
        //                             </UsernameToken>
        //                         </tds:Security>
        //                     </s:Header>
        //                     <s:Body>
        //                         <tds:GetStreamUri>
        //                             <tds:StreamSetup>
        //                                 <tds:Stream>RTP-Unicast</tds:Stream>
        //                                 <tds:Transport>
        //                                     <tds:Protocol>RTSP</tds:Protocol>
        //                                 </tds:Transport>
        //                             </tds:StreamSetup>
        //                             <tds:ProfileToken>{profileToken}</tds:ProfileToken>
        //                         </tds:GetStreamUri>
        //                     </s:Body>
        //                 </s:Envelope>";

        //         using var rtspClient = new HttpClient { Timeout = TimeSpan.FromSeconds(requestTimeoutSeconds) };
        //         rtspClient.DefaultRequestHeaders.Add("SOAPAction", "http://www.onvif.org/ver10/media/wsdl/GetStreamUri");

        //         var rtspResponse = await rtspClient.PostAsync($"http://{deviceIp}:{devicePort}/onvif/Media", new StringContent(rtspUriRequest, Encoding.UTF8, "application/soap+xml"));

        //         string rtspSoapResponse = await rtspResponse.Content.ReadAsStringAsync();
        //         Console.WriteLine(rtspSoapResponse);
        //         XDocument rtspSoapXml = XDocument.Parse(rtspSoapResponse);
        //         XNamespace rtspNs = "http://www.onvif.org/ver10/media/wsdl";
        //         string rtspUri = rtspSoapXml.Descendants(rtspNs + "Uri").FirstOrDefault()?.Value;

        //         if (string.IsNullOrEmpty(rtspUri))
        //         {
        //             return BadRequest("Failed to get the RTSP URI from the ONVIF device.");
        //         }

        //         // 记录获取的RTSP URI
        //         _logger.LogInformation($"Obtained RTSP URI: {rtspUri}");

        //         return Ok(rtspUri);
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, "An error occurred while getting the live stream.");
        //         return StatusCode(500, "Internal server error");
        //     }
        // }

        [HttpPost("convertImage")]
        public IActionResult ConvertImage([FromForm] IFormFile image, [FromForm] string targetFormat)
        {
            if (image == null)
                return BadRequest("Image is missing");

            if (string.IsNullOrWhiteSpace(targetFormat))
                return BadRequest("Target format is missing or empty");

            using var imageStream = new MemoryStream();
            image.CopyTo(imageStream);

            using var outputImage = Image.Load(imageStream.ToArray());
            using var outputStream = new MemoryStream();

            switch (targetFormat.ToLower())
            {
                case "png":
                    outputImage.Save(outputStream, new PngEncoder());
                    break;
                case "jpeg":
                    outputImage.Save(outputStream, new JpegEncoder());
                    break;
                case "jpg":
                    outputImage.Save(outputStream, new JpegEncoder());
                    break;

                // Add more formats if needed
                default:
                    return BadRequest("Unsupported format");
            }

            return File(outputStream.ToArray(), "application/octet-stream", $"converted.{targetFormat}");
        }

    }
}
