using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace app.Services
{
    public class VideoProcessService
    {
        public async Task<byte[]> ProcessVideoAsync(IFormFile inputVideo)
        {
            try
            {
                // 设置输出文件路径
                string outputFilePath = "C:\\Users\\limuf\\Desktop\\video\\result.avi";

                // 设置FFmpeg命令行参数（转换为AVI格式）
                string arguments = $"-i pipe:0 -c:v libxvid -c:a mp3 \"{outputFilePath}\"";

                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = "ffmpeg", // 确保"ffmpeg"在系统的PATH环境变量中
                    Arguments = arguments,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                // 异步启动FFmpeg进程
                using (Process process = new Process())
                {
                    process.StartInfo = psi;
                    process.OutputDataReceived += (sender, e) => Console.WriteLine(e.Data);
                    process.ErrorDataReceived += (sender, e) => Console.WriteLine("FFmpeg错误: " + e.Data);
                    process.Start();

                    // 将视频数据写入FFmpeg进程的标准输入流
                    await Task.Run(async () =>
     {
         using (var ffmpegInputStream = process.StandardInput.BaseStream)
         {
             await inputVideo.CopyToAsync(ffmpegInputStream);
         }
     });

                    process.BeginOutputReadLine();
                    process.BeginErrorReadLine();

                    // 异步等待FFmpeg完成
                    await process.WaitForExitAsync();

                    // 检查FFmpeg是否成功完成
                    if (process.ExitCode == 0)
                    {
                        // 读取转换后的视频数据
                        using (var resultStream = new MemoryStream())
                        {
                            // 从磁盘读取转换后的视频数据并写入到resultStream中
                            using (var fileStream = new FileStream(outputFilePath, FileMode.Open, FileAccess.Read))
                            {
                                await fileStream.CopyToAsync(resultStream);
                            }

                            // 返回转换后的视频数据的字节数组
                            return resultStream.ToArray();
                        }
                    }
                    else
                    {
                        // FFmpeg返回错误
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                // 处理失败，记录错误并返回null或错误消息
                Console.WriteLine("视频处理失败: " + ex.Message);
                return null;
            }
        }

        public async Task<byte[]> TrimAndCropVideoAsync(string inputVideoFilePath, TimeSpan startTime, TimeSpan endTime, int cropX, int cropY, int cropWidth, int cropHeight)
        {
            try
            {
                // 设置输出文件路径
                string outputFilePath = "C:\\Users\\limuf\\Desktop\\video\\trimmed_and_cropped_result.avi";

                // 设置FFmpeg命令行参数（转换为AVI格式并应用剪辑和裁剪）
                string startTimePoint = startTime.ToString(@"hh\:mm\:ss");
                string endTimePoint = endTime.ToString(@"hh\:mm\:ss");

                // 设置FFmpeg命令行参数（转换为AVI格式并应用剪辑和裁剪）
                string arguments = $"-ss {startTimePoint} -i pipe:0 -to {endTimePoint} -vf \"crop={cropWidth}:{cropHeight}:{cropX}:{cropY}\" -c:v libxvid -c:a mp3 -threads 4 \"{outputFilePath}\"";

                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = "ffmpeg", // 确保"ffmpeg"在系统的PATH环境变量中
                    Arguments = arguments,
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                // 启动FFmpeg进程
                using (Process process = new Process())
                {
                    process.StartInfo = psi;
                    process.OutputDataReceived += (sender, e) => Console.WriteLine(e.Data);
                    process.ErrorDataReceived += (sender, e) => Console.WriteLine("FFmpeg错误: " + e.Data);
                    process.Start();

                    process.BeginOutputReadLine();
                    process.BeginErrorReadLine();

                    // 异步等待FFmpeg完成
                    await process.WaitForExitAsync();

                    // 检查FFmpeg是否成功完成
                    if (process.ExitCode == 0)
                    {
                        // 读取剪辑和裁剪后的视频数据
                        using (var resultStream = new MemoryStream())
                        {
                            // 从磁盘读取视频数据并写入到resultStream中
                            using (var fileStream = new FileStream(outputFilePath, FileMode.Open, FileAccess.Read))
                            {
                                await fileStream.CopyToAsync(resultStream);
                            }

                            // 返回剪辑和裁剪后的视频数据的字节数组
                            return resultStream.ToArray();
                        }
                    }
                    else
                    {
                        // FFmpeg返回错误
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                // 处理失败，记录错误并返回null或错误消息
                Console.WriteLine("视频剪辑和裁剪失败: " + ex.Message);
                return null;
            }
        }

        
    }
}
