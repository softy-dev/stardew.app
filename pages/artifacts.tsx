import type { NextPage } from "next";

import achievements from "../research/processors/data/achievements.json";
import artifacts from "../research/processors/data/museum.json";

import AchievementCard from "../components/cards/achievementcard";
import InfoCard from "../components/cards/infocard";
import SidebarLayout from "../components/sidebarlayout";

import { useState } from "react";
import { useKV } from "../hooks/useKV";
import Head from "next/head";

import { InformationCircleIcon } from "@heroicons/react/solid";
import BooleanCard from "../components/cards/booleancard";
import FilterBtn from "../components/filterbtn";
import { useCategory } from "../utils/useCategory";

const Artifacts: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [_filter, setFilter] = useState<string>("off");

  const { data, error, isLoading } = useCategory("museum", "boolean");

  const [totalArtifactsFound, setTotalArtifactsFound] = useKV(
    "museum",
    "artifactsDonated",
    0
  );
  const [totalMineralsFound, setTotalMineralsFound] = useKV(
    "museum",
    "mineralsDonated",
    0
  );

  const [name] = useKV("general", "name", "Farmer");

  return (
    <>
      <Head>
        <title>stardew.app | Artifacts</title>
        <meta
          name="description"
          content="Track your Stardew Valley artifacts and museum progress. See what items you have left to donate for 100% completion on Stardew Valley."
        />
        <meta
          name="og:description"
          content="Track your Stardew Valley artifacts and museum progress. See what items you have left to donate for 100% completion on Stardew Valley."
        />
        <meta
          name="twitter:description"
          content="Track your Stardew Valley artifacts and museum progress. See what items you have left to donate for 100% completion on Stardew Valley."
        />
        <meta
          name="keywords"
          content="stardew valley museum tracker, stardew valley artifact tracker, stardew valley artifacts, stardew valley museum, stardew valley prismatic shard, prismatic shard, stardew valley, stardew, stardew checkup, stardew museum, stardew 100% completion, stardew perfection tracker, stardew, valley"
        />
      </Head>
      <SidebarLayout
        activeTab="Museum & Artifacts"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        <div className="mx-auto flex max-w-screen-2xl flex-shrink-0 items-center justify-between px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Museum & Artifacts
          </h1>
        </div>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
          <div>
            <h2 className="my-2 text-lg font-semibold text-gray-900 dark:text-white">
              Achievements
            </h2>
            <InfoCard
              title={`${name} has donated ${totalArtifactsFound}/42 artifacts and ${totalMineralsFound}/53 minerals.`}
              Icon={InformationCircleIcon}
              description={""}
            />

            <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {Object.values(achievements)
                .filter((achievement) => achievement.category === "museum")
                .map((achievement) => (
                  <AchievementCard
                    id={achievement.id}
                    tag={"achievements"}
                    key={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    sourceURL={achievement.iconURL}
                    initialChecked={
                      achievement.name === "A Complete Collection"
                        ? totalMineralsFound + totalArtifactsFound === 95
                        : totalMineralsFound + totalArtifactsFound >= 40
                    }
                  />
                ))}
            </div>
          </div>

          {/* ARTIFACTS */}
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Artifacts
          </h2>
          <div className="mt-2 flex items-center space-x-4">
            <FilterBtn
              _filter={_filter}
              setFilter={setFilter}
              targetState="true"
              title="Donated Artifact"
            />
            <FilterBtn
              _filter={_filter}
              setFilter={setFilter}
              targetState="false"
              title="Unfound Artifact"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Object.entries(artifacts.artifacts).map(([, artifact]) => (
                  <BooleanCard
                    key={artifact.itemID}
                    itemObject={artifact}
                    category="museum"
                    setCount={setTotalArtifactsFound}
                  />
                ))
              : Object.keys(data)
                  .filter((key) => {
                    if (_filter === "off") return true;
                    else return data[key] === JSON.parse(_filter);
                  })
                  .map((artifactID: string) => (
                    <BooleanCard
                      key={artifactID}
                      itemObject={
                        artifacts.artifacts[
                          artifactID as keyof typeof artifacts.artifacts
                        ]
                      }
                      category="museum"
                      setCount={setTotalArtifactsFound}
                    />
                  ))}
          </div>
          {/* END ARTIFACTS */}

          {/* MINERALS */}
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Minerals
          </h2>
          <div className="flex items-center space-x-4">
            <div className="mt-2">
              <div className="flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 dark:border-[#2A2A2A] dark:bg-[#191919]">
                <div className="h-4 w-4 rounded-full border border-green-900 bg-green-500/20" />
                <p className="text-sm dark:text-white">Donated Mineral</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center space-x-2 rounded-2xl border border-gray-300 bg-[#f0f0f0] p-2 dark:border-[#2A2A2A] dark:bg-[#191919]">
                <div className="h-4 w-4 rounded-full border border-gray-300 bg-white dark:border-[#2a2a2a] dark:bg-[#1f1f1f]" />
                <p className="text-sm dark:text-white">Unfound Mineral</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(artifacts.minerals).map(([, mineral]) => (
              <BooleanCard
                key={mineral.itemID}
                itemObject={mineral}
                category="museum"
                setCount={setTotalArtifactsFound}
              />
            ))}
          </div>
          {/* END MINERALS */}
        </div>
      </SidebarLayout>
    </>
  );
};

export default Artifacts;
