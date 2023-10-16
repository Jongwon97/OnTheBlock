package com.ontheblock.www;

import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.repository.MemberRepository;
import com.ontheblock.www.session.dto.SessionRequest;
import com.ontheblock.www.song.dto.SongRequest;
import com.ontheblock.www.video.dto.VideoRequest;
import com.ontheblock.www.video.service.VideoService;
import org.apache.commons.fileupload.FileItem;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.commons.io.IOUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@AutoConfigureMockMvc
@Rollback(value = false)
@SpringBootTest
@Transactional
public class videoUpLoadTests {
    @Autowired
    private VideoService videoService;
    @Autowired
    private MemberRepository memberRepository;

    private static final String path = "C:/Users/SSAFY/Music/data/bass";
    private static final String DEFAULT_IMAGE_PATH = "C:/Users/SSAFY/Music/data/logo_white.png";

    @Test
    public void test() throws IOException, ParseException {
        File dir = new File(path);
        File files[] = dir.listFiles();

        for (int i = 0; i < files.length; i++) {
            JSONParser parser = new JSONParser();
            // JSON 파일 읽기
            try {

                String filePath = files[i] + "/480p/video_info.json";
                FileInputStream fileInputStream = new FileInputStream(filePath);
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, "UTF-8");
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

                JSONObject jsonObject = (JSONObject) parser.parse(bufferedReader);
                String code = (String) jsonObject.get("code");
                Long id = (Long) jsonObject.get("song_id");
                String channelId = (String) jsonObject.get("channelId");
                String title = (String) jsonObject.get("title");
                String videoId = (String) jsonObject.get("videoId");
                Optional<Member> member = memberRepository.findByNickName(channelId);
                String videofilePath = "C:/Users/SSAFY/Music/data/bass/ㅎ-영상모음/"+title+".mp4";

                System.out.println(title);

                File file = new File(videofilePath);
                if(!file.exists()) continue;
                if (id == null) continue;

                if (member.isEmpty()) {
                    Member m = new Member();
                    m.updateNickName(channelId);
                    memberRepository.save(m);
                    member = Optional.of(m);
                }
                Member m = member.get();

                SessionRequest sr = new SessionRequest();
                sr.setMemberId(m.getId());
                sr.setInstrumentId(3L);
                sr.setStartPoint(0);
                sr.setSessionPosition("BACKGROUND");
                SongRequest song = new SongRequest();
                song.setSongId(Long.valueOf(id));

                VideoRequest vr = new VideoRequest();
                vr.setSession(sr);
                vr.setName(title);
                vr.setSong(song);
                vr.setDescription(videoId);

//                String videofilePath = "C:/Users/SSAFY/Music/data/bass/ㅎ-영상모음/"+title+".mp4";
                String thumbnailPath = "C:/Users/SSAFY/Music/data/bass/thumbnail/"+i+".png";
                String[] cmd = {"cmd.exe", "/c", "chcp", "65001", "&&", "chdir", "/d", "\"C:/FFMPEG/bin\"", "&&", "ffmpeg", "-i", "\""+videofilePath+"\"", "-ss", "00:00:01", "-vcodec", "png", "-vframes", "1", "\""+thumbnailPath+"\""};

                MultipartFile thumbnail = null;
                try {
                    ProcessBuilder builder = new ProcessBuilder(cmd);
                    Process start = builder.start();
                    boolean wait = start.waitFor(1000, TimeUnit.MILLISECONDS);
                    start.destroy();
                    System.out.println(wait);
                } catch (InterruptedException e){
                    int a = 0;
                } catch (Exception e) {
                    System.out.println("error : " + e.getMessage());
                    e.printStackTrace();
                }finally {
                    File tfile = new File(thumbnailPath);
                    if(tfile.exists()){
                        thumbnail  = new MockMultipartFile("t", title+".png", "image/png", new FileInputStream(thumbnailPath));
                    }

                    if(thumbnail == null) {
                        // 썸네일 추출 실패시 기본 이미지 썸네일로 사용
                        thumbnail  = new MockMultipartFile("t", title+".png", "image/png", new FileInputStream(DEFAULT_IMAGE_PATH));
                    }
                }
                MultipartFile sessionVideo = new MockMultipartFile("v", title + ".mp4", "video/mp4", new FileInputStream(path + "/ㅎ-영상모음/" + title + ".mp4"));
                videoService.saveVideo(vr, sessionVideo, thumbnail, m.getId()); // Session, Video, VideoSession 생성
            }
            catch (IOException e){
                continue;
            }
        }
    }

    @Test
    public void test2() throws IOException{
        String path = DEFAULT_IMAGE_PATH;
        MultipartFile thumbnail  = new MockMultipartFile("t", 1+".png", "image/png", new FileInputStream(DEFAULT_IMAGE_PATH));
    }

    @Test
    public void test3() throws IOException {
//        Runtime run = Runtime.getRuntime();
        String videofile = "C:/Users/SSAFY/Music/data/bass/ㅎ-영상모음/Agnostic Front - For my Family  Bass Cover With Tabs in the Video.mp4";
        String path = "C:/Users/SSAFY/Music/data/bass/thumb.png";
//        String command = "C:/FFMPEG/bin/ffmpeg.exe -i \"" + videofile + "\" -ss 00:00:01 -vcodec png -vframes 1 \"" + path + "\""; // 동영상 1초에서 Thumbnail 추출
        String[] cmd = {"cmd.exe", "/c", "chcp", "65001", "&&", "chdir", "/d", "\"C:/FFMPEG/bin\"", "&&", "ffmpeg", "-i", "\""+videofile+"\"", "-ss", "00:00:01", "-vcodec", "png", "-vframes", "1", "\""+path+"\""};
//        System.out.println(command);
        try {
            ProcessBuilder builder = new ProcessBuilder(cmd);
            Process start = builder.start();
            int i = start.waitFor();
            System.out.println(i);
        } catch (Exception e) {
            System.out.println("error : " + e.getMessage());
            e.printStackTrace();
        }
    }
}
